import type { MutableRefObject } from 'react';
import type { BFSDirection } from './direction';
import type { Coordinate, Entry } from '../../../../util/type';
import {
    setupPathfinder,
    markNode,
    recursiveAsyncGeneratorRunner,
    isObstruction,
    isOutOfBounds
} from '../../../../util';
import { Directions } from './direction';
import type { Direction, Grid } from '../../type';
import { PathfinderState, State } from '../../type';

type BeginBFSParams = {
    origin: Coordinate,
    target: Coordinate,
    grid: Grid,
    delay: MutableRefObject<number>,
    state: MutableRefObject<State>,
    resume: boolean,
    options: {
        direction: BFSDirection
    }
};

export type BeginBFS = (params: BeginBFSParams) => Promise<Entry | null>;

let queue: Entry[] = [];
let directions: Direction[] = [];
const visited: boolean[][] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async ({ origin, target, grid, delay, state, resume, options }) => {
    const { direction } = options;

    directions = Directions[direction];

    setupPathfinder(
        queue,
        {
            x: origin.x,
            y: origin.y,
            parent: null
        },
        grid,
        visited,
        resume
    );

    return await recursiveAsyncGeneratorRunner(bfsGenerator(target, grid, state), delay);
};

function* bfsGenerator(
    target: Coordinate,
    grid: Grid,
    state: MutableRefObject<State>
) {
    while (queue.length > 0) {
        const current = queue.shift()!;

        if (state.current === State.PATHFINDER_PAUSED) {
            return current;
        }

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
                queue.push({
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
