import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { mutateNode } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import type { PathfinderState } from '../../state';
import type { DFSDirection } from '../dfs/direction';

type BeginDFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    resume: boolean,
};

export type BeginDFS = (params: BeginDFSParams) => void;

type DFSStackEntry = Coordinate & {
    parent: null | DFSStackEntry
};

type DFSStack = DFSStackEntry[];

let stack: DFSStack = [];
const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];
const visited: boolean[][] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};

export const beginRandomObstructionGenerator: BeginDFS = ({ origin, goal, grid, delay, resume }) => {
    setupPathfinder(
        stack,
        {
            x: origin.x,
            y: origin.y,
            parent: null
        },
        grid,
        visited,
        resume
    );

    void recursiveAsyncGeneratorRunner(randomObstructionGenerator(goal, grid), delay);
};

function* randomObstructionGenerator(
    goal: Coordinate,
    grid: NodeReferences[][]
) {
    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited[current.y]![current.x]) {
            continue;
        }

        if (Math.random() > 0.5) {
            grid[current.y]![current.x]!.obstruction.current[1](true);
        }

        visited[current.y]![current.x] = true;

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x]) {
                stack.push({
                    x,
                    y,
                    parent: current
                });
            }
        }

        yield;
    }
}
