import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
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

export const beginCAMazeObstructionGenerator: BeginCAMazeObstructionGenerator = async ({ origin, goal, grid, delay }) => {
    // since React batches the state updates to the nodes, they are updated only after the following code has run,
    // and to prevent this, we run this in an async function that we await, so we'll have the updated nodes when running
    // the generator
    // eslint-disable-next-line @typescript-eslint/require-await
    // async function setObstructions() {
    //     for (const row of grid) {
    //         // ri++
    //         for (const node of row) {
    //             // ci++
    //             if (Math.random() >= 0.5) {
    //                 // if (row.length / 2)
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

    void recursiveAsyncGeneratorRunner(caMazeObstructionGenerator(grid), /* { current: 1000 } */ delay);
};

function* caMazeObstructionGenerator(
    grid: NodeReferences[][]
) {
    while (queue.length > 0) {
        const current = queue.shift()!;
        const [isCurrentObstruction, setCurrentObstruction] = grid[current.y]![current.x]!.obstruction.current;

        if (visited[current.y]![current.x]) continue;

        // grid[current.y]![current.x]!.setIsVisited.current(true);
        // setTimeout(() => grid[current.y]![current.x]!.setIsVisited.current(false), 1000);

        let adjacentPaths = 0;
        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid)) {
                if (!isObstruction(x, y, grid)) {
                    // grid[y]![x]!.setIsHighlighted.current(true);
                    // setTimeout(() => grid[y]![x]!.setIsHighlighted.current(false), 300);
                    adjacentPaths++;
                } else {
                    // grid[y]![x]!.setIsHighlighted.current(true);
                    // setTimeout(() => grid[y]![x]!.setIsHighlighted.current(false), 750);
                }

                if (!visited[y]![x]) {
                    queue.push({
                        x, y
                    });
                }
            }
        }


        if (adjacentPaths === 3 && isCurrentObstruction) {
            setCurrentObstruction(false);
        }
        else if ((adjacentPaths < 1 || adjacentPaths > 5) && !isCurrentObstruction) {
            setCurrentObstruction(true);
        }

        visited[current.y]![current.x] = true;

        yield;
    }

    // for (let y = 0; y < grid.length; y++) {
    //     for (let x = 0; x < grid[0]!.length; x++) {
    //         const current = grid[y]![x]!;

    //         let adjacentPaths = 0;
    //         for (const [dx, dy] of directions) {
    //             const nx = x + dx;
    //             const ny = y + dy;

    //             if (!isOutOfBounds(nx, ny, grid)) {
    //                 if (!isObstruction(nx, ny, grid)) {
    //                     grid[ny]![nx]!.setIsHighlighted.current(true);
    //                     setTimeout(() => grid[ny]![nx]!.setIsHighlighted.current(false), 100);
    //                     adjacentPaths++;
    //                 }
    //             }
    //         }

    //         if (adjacentPaths === 3 && current.obstruction.current[0]) {
    //             current.obstruction.current[1](false);
    //         }
    //         else if ((adjacentPaths < 1 || adjacentPaths > 5) && !current.obstruction.current[0]) {
    //             current.obstruction.current[1](true);
    //         }

    //         yield;
    //     }
    // }
}

