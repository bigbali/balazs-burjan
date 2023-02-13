import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { Nodes2 } from '../algorithms-page';
import type { Coordinate } from '../util/common';
import { isOutOfBounds } from '../util/common';

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
    velocity: RefObject<number>,
    direction: BFSDirection
) => void;

export const beginBFS: BeginBreadthFirstSearch = (origin, goal, grid, velocity, direction) => {
    directions = Directions[direction];

    const queue: Queue = [{
        x: origin.x,
        y: origin.y,
        parent: null
    }];

    const distance: number[][] = [];

    for (let y = 0; y < grid.length; y++) {
        const row: number[] = [];
        distance.push(row);

        for (let x = 0; x < grid[0]!.length; x++) {
            row.push(-1);
        }
    }

    distance[origin.y]![origin.x] = 0;

    BFS(queue, distance, goal, grid, velocity);
};

/**
 * Breadth-First Search implemented with recursion in order to be able to use with timeout
 */
function BFS(queue: Queue, distance: number[][], goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
    const current = queue.shift()!;
    if (!current) return;

    let isGoalReached = false;

    for (const [dx, dy] of directions) {
        const x = current.x + dx;
        const y = current.y + dy;

        if (!isOutOfBounds(x, y, grid) && distance[y]![x] === -1) {
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

            queue.push({ x, y, parent: current });

            // FIXME remove when ready
            distance[y]![x] = distance[current.y]![current.x]! + 1;

            if (x === goal.x && y === goal.y) {
                isGoalReached = true;
                console.log('distance between origin and goal', distance[y]![x]! - 1);
                break;
            }
        }
    }

    if (isGoalReached) {
        let node = queue.at(-1);
        let shortestDistance = 1;

        while (node && node.parent) {
            if (shortestDistance !== 1) { // don't highlight goal
                grid[node.y]![node.x]?.setIsHighlighted.current(true);
            };
            shortestDistance++;
            node = node.parent;
        }

        // FIXME pointless to return, wasted in settimeout
        return shortestDistance;
    }

    // having reached the end of the grid does not mean there is no way to find the goal
    // if (current.y === grid.length - 1 && current.x === grid[0]!.length - 1) return null;

    setTimeout(() => BFS(queue, distance, goal, grid, velocity), 1 / velocity.current! * 100);
}


export const BFSOptions = ({ option, setOption }: BFSOptionsProps) => {
    return (
        <div>
            <label htmlFor='bfsdirection'>
                Breadth-First Search directions:
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
