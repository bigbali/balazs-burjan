import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { asyncRecursiveAsyncGeneratorRunner } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';

type BeginCAMazeObstructionGeneratorParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>
};

export type BeginCAMazeObstructionGenerator = (params: BeginCAMazeObstructionGeneratorParams) => Promise<void>;

const queue: Coordinate[] = [];
const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 1],
    [1, 1],
    [1, -1],
    [1, 1]
] as const;
const visited: boolean[][] = [];

export const beginCAMazectricObstructionGenerator: BeginCAMazeObstructionGenerator = async ({ origin, goal, grid, delay }) => {
    // since React batches the state updates to the nodes, they are updated only after the following code has run,
    // and to prevent this, we run this in an async function that we await, so we'll have the updated nodes when running
    // the generator
    // eslint-disable-next-line @typescript-eslint/require-await
    // async function setObstructions() {
    //     for (const row of grid) {
    //         for (const node of row) {
    //             if (Math.random() >= 0.5) {
    //                 node.obstruction.current[1](true);
    //             }
    //         }
    //     }
    // }
    // await setObstructions();

    // eslint-disable-next-line @typescript-eslint/require-await
    async function x() {
        for (let i = origin.y - 5; i < origin.y + 5; i++) {
            for (let j = origin.x - 5; j <= origin.x + 5; j++) {
                if (!isOutOfBounds(j, i, grid) && Math.random() >= 0.25) {
                    grid[i]![j]!.obstruction.current[1](true);
                }
            }
        }
    };

    await x();


    setupPathfinder(
        queue,
        {
            x: origin.x,
            y: origin.y
        },
        grid,
        visited,
        false
    );

    grid[origin.y]![origin.x]!.obstruction.current[1](false);
    // grid[goal.y]![goal.x]!.obstruction.current[1](false);

    void asyncRecursiveAsyncGeneratorRunner(caMazectricObstructionGenerator(grid), /* { current: 1000 } */ delay);
};

async function* caMazectricObstructionGenerator(
    grid: NodeReferences[][]
) {
    // eslint-disable-next-line @typescript-eslint/require-await
    async function step() {
        let counter = 0;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0]!.length; x++) {
                const [isCurrentObstruction, setCurrentObstruction] = grid[y]![x]!.obstruction.current;

                // const current = grid[y]![x]!;

                let adjacentPaths = 0;
                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (!isOutOfBounds(nx, ny, grid)) {
                        if (!isObstruction(nx, ny, grid)) {
                            adjacentPaths++;
                        }
                    }
                }

                counter++; // should be 3, but it works with 2 and not with 3. fun it is :)
                if (adjacentPaths === 4 && isCurrentObstruction) {
                    setCurrentObstruction(false);
                }
                else if ((adjacentPaths < 1 || adjacentPaths > 4) && !isCurrentObstruction) {
                    setCurrentObstruction(true);
                }

            }
        }
        console.log('counter', counter);

    }

    for (let i = 0; i < 100; i++) {
        await new Promise(resolve => {
            setTimeout(resolve, 10);
        });

        await step();
        yield;
    }

    console.log('done');
}

