import type { MutableRefObject } from 'react';
import type { Nodes2 } from '../..';
import type { Coordinate } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import { PathfinderState } from '../../state';
import type { BFSDirection, Direction } from './direction';
import { Directions } from './direction';

type BeginBFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: Nodes2[][],
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
let visited: boolean[][] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async ({ origin, goal, grid, delay, state, resume, options }) => {
    const { direction } = options;

    directions = Directions[direction];

    // if we are resuming the algorithm, we don't want to start at the first node,
    // instead we'll start with the existing queue
    if (!resume) {
        queue.push({
            x: origin.x,
            y: origin.y,
            parent: null
        });
    }

    // if we are resuming, do not reset the visited matrix
    if (!resume) {
        const newVisited: typeof visited = [];
        for (let y = 0; y < grid.length; y++) {
            const row: boolean[] = [];
            newVisited.push(row);

            for (let x = 0; x < grid[0]!.length; x++) {
                row.push(false);
            }
        }

        visited = newVisited;
    }

    const generator = BFSStep(goal, grid, visited, state);
    return await BFS(generator, delay);
};

type BFSRunner = (
    bfs: Generator<undefined, BFSQueueEntry | undefined, unknown>,
    delay: MutableRefObject<number>
) => Promise<BFSQueueEntry | undefined>;

const BFS: BFSRunner = async (bfs, delay) => {
    const result = bfs.next();

    if (result.done) {
        return result.value;
    }

    // dark magic, don't touch
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay.current);
    });

    // when this finally resolves, we return the nodes that make up the shortest path
    return await BFS(bfs, delay);
};

function* BFSStep(
    goal: Coordinate,
    grid: Nodes2[][],
    visited: boolean[][],
    state: MutableRefObject<PathfinderState>
) {
    while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.x === goal.x && current.y === goal.y) {
            return current;
        }

        if (state.current === PathfinderState.PAUSED) {
            return;
        }

        if (visited[current.y]![current.x]) {
            continue;
        }

        const {
            setIsVisited: {
                current: setIsVisited
            },
            setIsHighlighted
        } = grid[current.y]![current.x]!;

        setIsHighlighted.current(true);
        setTimeout(() => setIsHighlighted.current(false), 200);

        if (isObstruction(current.x, current.y, grid)) {
            continue;
        }

        setIsVisited(true);
        visited[current.y]![current.x] = true;

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
