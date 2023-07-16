import type { MutableRefObject } from 'react';
import type { Grid } from '../../type';
import type { Direction } from '../../direction';
import type { RandomOptions } from './options';
import type { Coordinate } from '../../../../util/type';
import { setupPathfinder, isOutOfBounds } from '../../../../util';

type BeginRandomObstructionGeneratorParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: Grid,
    delay: MutableRefObject<number>,
    options: RandomOptions
};

export type BeginRandomObstructionGenerator = (params: BeginRandomObstructionGeneratorParams) => void;

const stack: Coordinate[] = [];
const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];
const visited: boolean[][] = [];

export const beginRandomObstructionGenerator: BeginRandomObstructionGenerator = ({ origin, grid, options }) => {
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

    generateRandomObstructions(grid, options);
};

function generateRandomObstructions(
    grid: BeginRandomObstructionGeneratorParams['grid'],
    { probability: p }: BeginRandomObstructionGeneratorParams['options']
) {
    const probability = p / 100;

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited[current.y]![current.x]) {
            continue;
        }

        if (Math.random() <= probability) {
            grid[current.y]![current.x]!.obstruction[1](true);
        }

        visited[current.y]![current.x] = true;

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x]) {
                stack.push({
                    x,
                    y
                });
            }
        }
    }
}
