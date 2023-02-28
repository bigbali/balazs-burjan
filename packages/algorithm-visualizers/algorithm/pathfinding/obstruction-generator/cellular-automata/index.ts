import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { asyncRecursiveAsyncGeneratorRunner } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
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
    if (options.initialPattern.type === 'random') {
        // async to prevent batching which causes this to run after the rest of the program
        // eslint-disable-next-line @typescript-eslint/require-await
        async function generateRandomObstructions() {
            for (const row of grid) {
                for (const node of row) {
                    if (Math.random() <= ( // TS needs a bit of help to realize that at this point, type can only be 'random'
                        options.initialPattern.type === 'random'
                            ? options.initialPattern.probability / 100
                            : 0)
                    ) {
                        node.obstruction.current[1](true);
                    }
                }
            }
        }

        await generateRandomObstructions();
    }

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

    void asyncRecursiveAsyncGeneratorRunner(caMazectricObstructionGenerator(grid, delay, options), { current: 0 });
};

async function* caMazectricObstructionGenerator(
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    options: CellularAutomataOptions
) {
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
    }

    for (let i = 0; i < options.steps; i++) {
        if (options.interrupt?.current) {
            return;
        }

        await new Promise(resolve => {
            setTimeout(resolve, delay.current);
        });

        step();
        yield;
    }
}

