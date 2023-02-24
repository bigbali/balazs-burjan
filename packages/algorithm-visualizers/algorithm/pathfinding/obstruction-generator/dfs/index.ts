import shuffle from 'lodash/shuffle';
import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import type { PathfinderState } from '../../state';

type BeginDFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
};

export type BeginDFS = (params: BeginDFSParams) => Promise<void>;

type DFSStackEntry = Coordinate & {
    parent: null | DFSStackEntry
};

type DFSStack = DFSStackEntry[];

let stack: DFSStack = [];
const directions: Direction[] = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2]
];
const visited: boolean[][] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};


export const beginDFSObstructionGenerator: BeginDFS = async ({ origin, goal, grid, delay }) => {
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

    void recursiveAsyncGeneratorRunner(dfsGenerator(goal, grid), delay);
};

function* dfsGenerator(
    goal: Coordinate,
    grid: NodeReferences[][]
) {
    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited[current.y]![current.x]) continue;

        for (const [dx, dy] of shuffle(directions)) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x] && isObstruction(x, y, grid)) {
                grid[y]![x]!.obstruction.current[1](false);
                const mx = current.x + (dx / 2);
                const my = current.y + (dy / 2);

                if (!isOutOfBounds(my, my, grid) && !visited[my]![mx]) {
                    grid[my]![mx]!.obstruction.current[1](false);

                    stack.push({
                        x,
                        y,
                        parent: current
                    });

                    visited[my]![mx] = true;
                }
            }
        }

        yield;
    }
}

