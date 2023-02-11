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

type QueueEntry = Coordinate & {
    parent: null | QueueEntry
};

type Queue = QueueEntry[];

export function beginBFS(origin: Coordinate, goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
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
}

/**
 * Breadth-First Search implemented with recursion in order to be able to use with timeout
 */
function BFS(queue: Queue, distance: number[][], goal: Coordinate, grid: Nodes2[][], velocity: RefObject<number>) {
    const current = queue.shift()!;
    if (!current) return;

    let isGoalReached = false;

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

            if (isObstruction) {
                continue;
            }

            setIsVisited(true);

            queue.push({ x, y, parent: current });

            // FIXME remove when ready
            distance[y]![x] = distance[current.y]![current.x]! + 1;

            if (x === goal.x && y === goal.y) {
                isGoalReached = true;
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

        console.log(shortestDistance);

        // FIXME pointless to return, wasted in settimeout
        return shortestDistance;
    }

    if (current.y === grid.length - 1 && current.x === grid[0]!.length - 1) return null;

    setTimeout(() => BFS(queue, distance, goal, grid, velocity), velocity.current!);
}
