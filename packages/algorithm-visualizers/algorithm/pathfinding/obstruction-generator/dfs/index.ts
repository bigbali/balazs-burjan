import shuffle from 'lodash/shuffle';
import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';

type BeginDFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>
};

export type BeginDFSObstructionGenerator = (params: BeginDFSParams) => Promise<void>;

type DFSStackEntry = Coordinate;

type DFSStack = DFSStackEntry[];

const stack: DFSStack = [];
const directions: Direction[] = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2]
];
const visited: boolean[][] = [];

export const beginDFSObstructionGenerator: BeginDFSObstructionGenerator = async ({ origin, goal, grid, delay }) => {
    // since React batches the state updates to the nodes, they are updated only after the following code has run,
    // and to prevent this, we run this in an async function that we await, so we'll have the updated nodes when running
    // the generator
    // eslint-disable-next-line @typescript-eslint/require-await
    async function setObstructions() {
        for (const row of grid) {
            for (const node of row) {
                node.obstruction.current[1](true);
            }
        }
    }

    await setObstructions();

    setupPathfinder(
        stack,
        {
            x: origin.x,
            y: origin.y,
            parent: null
        },
        grid,
        visited,
        false
    );

    grid[origin.y]![origin.x]!.obstruction.current[1](false);
    grid[goal.y]![goal.x]!.obstruction.current[1](false);

    void recursiveAsyncGeneratorRunner(dfsObstructionGenerator(grid), delay);
};

function* dfsObstructionGenerator(
    grid: NodeReferences[][]
) {
    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited[current.y]![current.x]) {
            continue;
        }

        for (const [dx, dy] of shuffle(directions)) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x] && isObstruction(x, y, grid)) {
                const setObstruction = grid[y]![x]!.obstruction.current[1];
                setObstruction(false);

                const mx = current.x + (dx / 2);
                const my = current.y + (dy / 2);

                if (!isOutOfBounds(my, my, grid) && !visited[my]![mx]) {
                    grid[my]![mx]!.obstruction.current[1](false);

                    stack.push({
                        x,
                        y
                    });

                    visited[my]![mx] = true;
                }
            }
        }

        yield;
    }
}

