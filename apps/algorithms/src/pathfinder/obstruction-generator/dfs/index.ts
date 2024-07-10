import shuffle from 'lodash/shuffle';
import {
    setupPathfinder,
    isObstruction,
    isOutOfBounds,
    generatorRunner
} from '../../../../util';
import type { Coordinate } from '../../../../util/type';
import type { AsyncObstructionGenerator, Grid } from '../../../type';

const stack: Coordinate[] = [];
const directions = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2]
] as const;
const visited: boolean[][] = [];

export const beginDFSObstructionGenerator: AsyncObstructionGenerator = async ({ origin, target, grid, delay }) => {
    // since React batches the state updates to the nodes, they are updated only after the following code has run,
    // and to prevent this, we run this in an async function that we await, so we'll have the updated nodes when running
    // the generator
    // eslint-disable-next-line @typescript-eslint/require-await
    async function setObstructions() {
        for (const row of grid) {
            for (const node of row) {
                node.obstruction[1](true);
            }
        }
    }

    await setObstructions();

    setupPathfinder(
        stack,
        {
            x: origin.x,
            y: origin.y
        },
        grid,
        visited,
        false
    );

    grid[origin.y]![origin.x]!.obstruction[1](false);
    grid[target.y]![target.x]!.obstruction[1](false);

    return await generatorRunner(dfsObstructionGenerator(grid), delay);
};

function* dfsObstructionGenerator(
    grid: Grid
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
                const setObstruction = grid[y]![x]!.obstruction[1];
                setObstruction(false);

                const mx = current.x + (dx / 2);
                const my = current.y + (dy / 2);

                if (!isOutOfBounds(my, my, grid) && !visited[my]![mx]) {
                    grid[my]![mx]!.obstruction[1](false);

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

    return true;
}

