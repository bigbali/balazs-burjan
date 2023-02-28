import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { asyncRecursiveAsyncGeneratorRunner } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { CellularAutomataOptions } from './options';

type BeginCAObstructionGeneratorParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    options: CellularAutomataOptions
};

export type BeginCAObstructionGenerator = (params: BeginCAObstructionGeneratorParams) => Promise<void>;

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

export const beginCAObstructionGenerator: BeginCAObstructionGenerator = async ({ origin, goal, grid, delay, options }) => {
    // since React batches the state updates to the nodes, they are updated only after the following code has run,
    // and to prevent this, we run this in an async function that we await, so we'll have the updated nodes when running
    // the generator
    // eslint-disable-next-line @typescript-eslint/require-await
    async function setObstructions() {
        for (const row of grid) {
            for (const node of row) {
                if (Math.random() >= 0.6) {
                    node.obstruction.current[1](true);
                }
            }
        }
    }
    await setObstructions();

    // eslint-disable-next-line @typescript-eslint/require-await
    // async function x() {
    //     for (let i = origin.y - 5; i < origin.y + 5; i++) {
    //         for (let j = origin.x - 5; j <= origin.x + 5; j++) {
    //             if (!isOutOfBounds(j, i, grid) && Math.random() >= 0.25) {
    //                 grid[i]![j]!.obstruction.current[1](true);
    //             }
    //         }
    //     }
    // };

    // await x();

    if (options.interrupt) {
        options.interrupt.current = false;
    }


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

    // grid[origin.y]![origin.x]!.obstruction.current[1](false);
    // grid[goal.y]![goal.x]!.obstruction.current[1](false);

    void asyncRecursiveAsyncGeneratorRunner(caMazectricObstructionGenerator(grid, delay, options), { current: 0 } /* delay */);
};

async function* caMazectricObstructionGenerator(
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    options: CellularAutomataOptions
) {
    // eslint-disable-next-line @typescript-eslint/require-await
    function step() {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0]!.length; x++) {
                const [isCurrentObstruction, setCurrentObstruction] = grid[y]![x]!.obstruction.current;

                let adjacentPaths = 0;
                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (!isOutOfBounds(nx, ny, grid)) {
                        if (isObstruction(nx, ny, grid)) {
                            adjacentPaths++;
                        }
                    }
                }

                if (adjacentPaths === options.setAlive && !isCurrentObstruction) {
                    setCurrentObstruction(true);
                }
                else if (
                    (adjacentPaths < options.keepAlive.min || adjacentPaths > options.keepAlive.max)
                    && isCurrentObstruction) {
                    setCurrentObstruction(false);
                }

            }
        }
        // }
        // eslint-disable-next-line @typescript-eslint/require-await
        // function step() {
        //     for (let y = 0; y < grid.length; y++) {
        //         for (let x = 0; x < grid[0]!.length; x++) {
        //             const [isCurrentObstruction, setCurrentObstruction] = grid[y]![x]!.obstruction.current;

        //             let adjacentPaths = 0;
        //             for (const [dx, dy] of directions) {
        //                 const nx = x + dx;
        //                 const ny = y + dy;

        //                 if (!isOutOfBounds(nx, ny, grid)) {
        //                     if (isObstruction(nx, ny, grid)) {
        //                         adjacentPaths++;
        //                     }
        //                 }
        //             }

        //             if (isCurrentObstruction) {
        //                 if (adjacentPaths === 3 || adjacentPaths === 4) {
        //                     setCurrentObstruction(true);
        //                 }
        //                 else {
        //                     setCurrentObstruction(false);

        //                 }
        //             }
        //             else {
        //                 if (adjacentPaths === 3) {
        //                     setCurrentObstruction(true);
        //                 }
        //                 else {
        //                     setCurrentObstruction(false);

        //                 }

        //             }


        //             // if (adjacentPaths === 3 && !isCurrentObstruction) {
        //             //     setCurrentObstruction(true);
        //             // }
        //             // else if (
        //             //     (adjacentPaths < options.keepAlive.min || adjacentPaths > options.keepAlive.max)
        //             //     && isCurrentObstruction) {
        //             //     setCurrentObstruction(false);
        //             // }

        //         }
        //     }
    }

    for (let i = 0; i < options.steps; i++) {
        if (options.interrupt?.current) {
            console.log('interrupt');
            return;
        }

        await new Promise(resolve => {
            setTimeout(resolve, delay.current);
        });

        step();
        yield;
    }

    console.log('done');
}

