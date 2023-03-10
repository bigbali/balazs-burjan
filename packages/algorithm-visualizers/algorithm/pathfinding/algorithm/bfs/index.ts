import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { mutateNode } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import { PathfinderState } from '../../state';
import type { BFSDirection } from './direction';
import { Directions } from './direction';

type BeginBFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    resume: boolean,
    options: {
        direction: BFSDirection
    }
};

export type BeginBFS = (params: BeginBFSParams) => Promise<BFSQueueEntry | undefined>;

type BFSQueueEntry = Coordinate & {
    parent: null | BFSQueueEntry
};

type BFSQueue = BFSQueueEntry[];

let queue: BFSQueue = [];
let directions: Direction[] = [];
const visited: boolean[][] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async ({ origin, goal, grid, delay, state, resume, options }) => {
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

    return await recursiveAsyncGeneratorRunner(bfsGenerator(goal, grid, state), delay);
};

function* bfsGenerator(
    goal: Coordinate,
    grid: NodeReferences[][],
    state: MutableRefObject<PathfinderState>
) {
    while (queue.length > 0) {
        if (state.current === PathfinderState.PAUSED) {
            return;
        }

        const current = queue.shift()!;

        if (current.x === goal.x && current.y === goal.y) {
            return current;
        }

        if (visited[current.y]![current.x]) {
            continue;
        }

        const setVisited = mutateNode(grid, visited, current.x, current.y);

        if (isObstruction(current.x, current.y, grid)) {
            continue;
        }

        setVisited();

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
}
