import type { MutableRefObject } from 'react';
import type { Nodes2 } from '../..';
import type { Coordinate } from '../../../util/common';
import { isOutOfBounds } from '../../../util/common';
import { PathfinderState } from '../../state';
import type { BFSDirection, Direction } from './direction';
import { Directions } from './direction';

export type BeginBreadthFirstSearch = (
    origin: Coordinate,
    goal: Coordinate,
    grid: Nodes2[][],
    velocity: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    options: {
        direction: BFSDirection
    }
) => void;

type QueueEntry = Coordinate & {
    parent: null | QueueEntry
};

type Queue = QueueEntry[];

// we are storing queue as a top level variable because it's much easier
let queue: Queue = [];
let directions: Direction[] = [];


export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBreadthFirstSearch = (origin, goal, grid, velocity, state, options) => {
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

    visited[origin.y]![origin.x] = true;

    const generator = BFSStep(goal, grid, visited, state);
    BFS(generator, velocity);
};

type BFSRunner = (
    bfs: Generator<undefined, void, unknown>,
    velocity: MutableRefObject<number>
) => void;

const BFS: BFSRunner = (bfs, velocity) => {
    bfs.next();

    setTimeout(() => BFS(bfs, velocity), 1 / velocity.current * 100);
};

function* BFSStep(
    goal: Coordinate,
    grid: Nodes2[][],
    visited: boolean[][],
    state: MutableRefObject<PathfinderState>
) {
    let isGoalReached = false;

    while (!isGoalReached) {
        console.log('while', state.current);
        if (state.current === PathfinderState.STOPPED) {
            // clear grid
            queue = [];
            return;
        }
        if (state.current === PathfinderState.PAUSED) {
            return;
        }

        const current = queue.shift()!;
        if (!current) return;

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x]) {
                const {
                    isObstruction: {
                        current: isObstruction
                    },
                    setIsVisited: {
                        current: setIsVisited
                    }
                } = grid[y]![x]!;

                if (isObstruction) {
                    continue;
                }

                setIsVisited(true);

                queue.push({
                    x,
                    y,
                    parent: current
                });

                visited[y]![x] = true;

                if (x === goal.x && y === goal.y) {
                    isGoalReached = true;
                    break;
                }
            }
        }

        if (isGoalReached) {
            let node = queue.at(-1);

            while (node && node.parent) {
                if (!(node.x === goal.x && node.y === goal.y)) { // don't highlight goal
                    grid[node.y]![node.x]?.setIsHighlighted.current(true);
                };
                node = node.parent;
            }

            return;
        }

        yield;
    }
}
