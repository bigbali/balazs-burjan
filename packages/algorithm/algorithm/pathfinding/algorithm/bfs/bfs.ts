import type { MutableRefObject } from 'react';
import type { Nodes2 } from '../..';
import type { Coordinate } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import { PathfinderState } from '../../state';
import type { BFSDirection, Direction } from './direction';
import { Directions } from './direction';

export type BeginBFS = (
    origin: Coordinate,
    goal: Coordinate,
    grid: Nodes2[][],
    velocity: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    options: {
        direction: BFSDirection
    }
) => Promise<QueueEntry | undefined>;

type QueueEntry = Coordinate & {
    parent: null | QueueEntry
};

type Queue = QueueEntry[];

let queue: Queue = [];
let directions: Direction[] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async (origin, goal, grid, velocity, state, options) => {
    const { direction } = options;

    directions = Directions[direction];

    queue.push({
        x: origin.x,
        y: origin.y,
        parent: null
    });

    const visited: boolean[][] = [];

    for (let y = 0; y < grid.length; y++) {
        const row: boolean[] = [];
        visited.push(row);

        for (let x = 0; x < grid[0]!.length; x++) {
            row.push(false);
        }
    }

    const generator = BFSStep(goal, grid, visited, state);
    return await BFS(generator, velocity);
};

type BFSRunner = (
    bfs: Generator<undefined, QueueEntry | undefined, unknown>,
    velocity: MutableRefObject<number>
) => Promise<QueueEntry | undefined>;

const BFS: BFSRunner = async (bfs, velocity) => {
    const result = bfs.next();

    if (result.done) {
        return result.value;
    }

    // dark magic, don't touch
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1 / velocity.current * 100);
    });

    return await BFS(bfs, velocity);
};

function* BFSStep(
    goal: Coordinate,
    grid: Nodes2[][],
    visited: boolean[][],
    state: MutableRefObject<PathfinderState>
) {
    while (queue.length > 0) {
        if (state.current === PathfinderState.STOPPED) {
            queue = [];
            return;
        }

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
