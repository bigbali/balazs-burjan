import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';

type BeginRandomObstructionGeneratorParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>
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

export const beginRandomObstructionGenerator: BeginRandomObstructionGenerator = ({ origin, grid, delay }) => {
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

    void recursiveAsyncGeneratorRunner(randomObstructionGenerator(grid), delay);
};

function* randomObstructionGenerator(
    grid: NodeReferences[][]
) {
    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited[current.y]![current.x]) {
            continue;
        }

        if (Math.random() >= 0.5) {
            grid[current.y]![current.x]!.obstruction.current[1](true);
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

        yield;
    }
}
