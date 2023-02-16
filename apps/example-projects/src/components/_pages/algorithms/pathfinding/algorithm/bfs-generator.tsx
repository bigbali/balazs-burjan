import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react';
import type { Nodes2 } from '../index';
import type { Coordinate } from '../../util/common';
import { isOutOfBounds } from '../../util/common';
import { PathfindingAlgorithmsState } from '../state';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
};

export type BFSOptionsProps = {
    option: BFSDirection,
    setOption: Dispatch<SetStateAction<BFSDirection>>
};

type Direction = [number, number];

const BFSOrthogonalDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];

const BFSDiagonalDirections = [
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
]satisfies Direction[];

const BFSHybridDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
]satisfies Direction[];

const Directions = {
    [BFSDirection.ORTHOGONAL]: BFSOrthogonalDirections,
    [BFSDirection.DIAGONAL]: BFSDiagonalDirections,
    [BFSDirection.HYBRID]: BFSHybridDirections
};

let directions: Direction[] = [];

type QueueEntry = Coordinate & {
    parent: null | QueueEntry
};

type Queue = QueueEntry[];

export type BeginBreadthFirstSearch = (
    origin: Coordinate,
    goal: Coordinate,
    grid: Nodes2[][],
    velocity: MutableRefObject<number>,
    state: MutableRefObject<PathfindingAlgorithmsState>,
    options: {
        direction: BFSDirection
    }
) => void;

let savedqueue: Queue | undefined;

export const beginBFS: BeginBreadthFirstSearch = (origin, goal, grid, velocity, state, options) => {
    const { direction } = options;

    directions = Directions[direction];

    const queue: Queue = [{
        x: origin.x,
        y: origin.y,
        parent: null
    }];

    // TODO i rly dislike this solution, find better
    const visited: boolean[][] = [];

    for (let y = 0; y < grid.length; y++) {
        const row: boolean[] = [];
        visited.push(row);

        for (let x = 0; x < grid[0]!.length; x++) {
            row.push(false);
        }
    }

    visited[origin.y]![origin.x] = true;

    if (savedqueue) console.log('using saved queue');

    const generator = BFSStep(savedqueue || queue, goal, grid, visited, state);
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

/**
 * Breadth-First Search implemented with recursion in order to be able to use with timeout
 */
function* BFSStep(
    queue: Queue,
    goal: Coordinate,
    grid: Nodes2[][],
    visited: boolean[][],
    state: MutableRefObject<PathfindingAlgorithmsState>
) {
    let isGoalReached = false;

    while (!isGoalReached) {
        console.log('while', state.current);
        if (state.current === PathfindingAlgorithmsState.STOPPED) {
            // clear grid
            return;
        }
        if (state.current === PathfindingAlgorithmsState.PAUSED) {
            savedqueue = queue;
            return;
        } else {
            savedqueue = undefined;
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

export const BFSOptions = ({ option, setOption }: BFSOptionsProps) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='bfsdirection'>
                Directions:
            </label>
            <select
                id='bfsdirection'
                className='capitalize'
                value={option}
                onChange={(e) => {
                    setOption(e.currentTarget.value as BFSDirection);
                }}>
                {Object.values(BFSDirection).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
