import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { Coordinate } from '../../../util/common';
import { isOutOfBounds } from '../../../util/common';
import type { Nodes2 } from '../index';
import type { PathfinderState } from '../state';

export enum DFSDirection {
    TBLR = 'top to bottom, left to right',
    TBRL = 'top to bottom, right to left',
    BTLR = 'bottom to top, left to right',
    BTRL = 'bottom to top, right to left'
};

export type DFSOptionsProps = {
    option: DFSDirection,
    setOption: Dispatch<SetStateAction<DFSDirection>>
};

type Direction = [number, number];

const DFSTopToBottomLeftToRight = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];

const DFSTopToBottomRightToLeft = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1]
]satisfies Direction[];

const DFSBottomToTopLeftToRight = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];

const DFSBottomToTopRightToLeft = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
]satisfies Direction[];

const Directions = {
    [DFSDirection.TBLR]: DFSTopToBottomLeftToRight,
    [DFSDirection.TBRL]: DFSTopToBottomRightToLeft,
    [DFSDirection.BTLR]: DFSBottomToTopLeftToRight,
    [DFSDirection.BTRL]: DFSBottomToTopRightToLeft
};

let directions: Direction[] = [];

type StackEntry = Coordinate & {
    parent: null | StackEntry,
    distance: number
};

type Stack = StackEntry[];

export type BeginDepthFirstSearch = (
    origin: Coordinate,
    goal: Coordinate,
    grid: Nodes2[][],
    velocity: RefObject<number>,
    state: PathfinderState,
    options: {
        direction: DFSDirection
    }
) => void;

export const beginDFS: BeginDepthFirstSearch = (origin, goal, grid, velocity, state, { direction }) => {
    directions = Directions[direction];

    const stack: Stack = [{
        x: origin.x,
        y: origin.y,
        parent: null,
        distance: 0
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

    DFS(stack, distance, goal, grid, velocity);
};

/**
 * Depth-First Search implemented with recursion in order to be able to use with timeout
 */
function DFS(stack: Stack, distance: number[][], goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
    const current = stack.pop()!;
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

            stack.push({ x, y, parent: current, distance: current.distance + 1 });

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
        let node = stack.pop();
        let shortestDistance = 1;

        while (node && node.parent) {
            if (shortestDistance !== 1) { // don't highlight goal
                grid[node.y]![node.x]?.setIsHighlighted.current(true);
            };
            shortestDistance++;
            node = node.parent;
        }

        console.log('sd', shortestDistance);
        console.log('d', distance);

        // FIXME pointless to return, wasted in settimeout
        return shortestDistance;
    }

    setTimeout(() => DFS(stack, distance, goal, grid, velocity), 1 / velocity.current! * 100);
}


export const DFSOptions = ({ option, setOption }: DFSOptionsProps) => {
    return (
        <div>
            <label htmlFor='dfsdirection'>
                Depth-First Search directions:
            </label>
            <select
                id='dfsdirection'
                className='capitalize'
                value={option}
                onChange={(e) => {
                    setOption(e.currentTarget.value as DFSDirection);
                }}>
                {Object.values(DFSDirection).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
