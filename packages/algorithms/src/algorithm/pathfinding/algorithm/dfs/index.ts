import type { MutableRefObject } from 'react';
import type { DFSDirection } from './direction';
import { Directions } from './direction';
import {
    setupPathfinder,
    markNode,
    recursiveAsyncGeneratorRunner,
    isObstruction,
    isOutOfBounds
} from '../../../../util';
import type { Coordinate, Entry } from '../../../../util/type';
import type { Direction, Grid } from '../../type';
import { PathfinderState } from '../../type';

type BeginDFSParams = {
    origin: Coordinate,
    target: Coordinate,
    grid: Grid,
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    resume: boolean,
    options: {
        direction: DFSDirection
    }
};

export type BeginDFS = (params: BeginDFSParams) => Promise<Entry>;

let stack: Entry[] = [];
let directions: Direction[] = [];
const visited: boolean[][] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};

export const beginDFS: BeginDFS = async ({ origin, target, grid, delay, state, resume, options }) => {
    const { direction } = options;

    directions = Directions[direction];

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

    return await recursiveAsyncGeneratorRunner(dfsGenerator(target, grid, state), delay);
};

function* dfsGenerator(
    target: Coordinate,
    grid: Grid,
    state: MutableRefObject<PathfinderState>
) {
    while (stack.length > 0) {
        if (state.current === PathfinderState.PAUSED) {
            return null;
        }

        const current = stack.pop()!;

        if (current.x === target.x && current.y === target.y) {
            return current;
        }

        if (visited[current.y]![current.x]) {
            continue;
        }

        if (isObstruction(current.x, current.y, grid)) {
            continue;
        }

        markNode(grid, visited, current.x, current.y);

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x] && !isObstruction(x, y, grid)) {
                stack.push({
                    x,
                    y,
                    parent: current
                });
            }
        }

        yield;
    }

    return null;
}
