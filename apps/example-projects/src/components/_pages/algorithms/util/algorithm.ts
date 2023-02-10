import type { RefObject } from 'react';
import type { Nodes2 } from '../algorithms-page';
import type { Coordinate } from './common';
import { isOutOfBounds } from './common';

const Directions = {
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    UP: [0, -1],
    DOWN: [0, 1]
} as const;

export function beginBFS(origin: Coordinate, goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
    const queue = [{
        x: origin.x,
        y: origin.y
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
}

/**
 * Breadth-First Search implemented with recursion in order to be able to use with timeout
 */
function BFS(queue: Coordinate[], distance: number[][], goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
    const current = queue.shift()!;
    if (!current) return;

    for (const [dx, dy] of Object.values(Directions)) {
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
            // const xxx = grid[y]!;
            if (isObstruction) {
                continue;
            }

            // if (!xxx) {
            //     console.log(grid, y);
            //     return;
            // }

            if (x === goal.x && y === goal.y) {
                return;
            }
            // setColor2({
            //     node: {
            //         x,
            //         y
            //     },
            //     grid
            // });

            setIsVisited(true);


            distance[y]![x] = distance[current.y]![current.x]! + 1;
            queue.push({ x, y });
        }
    }

    setTimeout(() => BFS(queue, distance, goal, grid, velocity), velocity.current!);
}
