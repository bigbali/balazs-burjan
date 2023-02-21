import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { mutateNode } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import { PathfinderState } from '../../state';
import type { BFSDirection } from '../bfs/direction';
import type { DijkstraQueueEntry } from './priority-queue';
import { PriorityQueue } from './priority-queue';

type BeginDijkstraParams = {
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

const pq = new PriorityQueue();

export type BeginDijkstra = (params: BeginDijkstraParams) => Promise<DijkstraQueueEntry | undefined>;

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];

let visited: boolean[][] = [];

export const resetDijkstra = (callback: () => void) => {
    pq.clear();
    callback();
};

export const beginDijkstra: BeginDijkstra = async ({ origin, goal, grid, delay, state, resume }) => {
    // if we are resuming the algorithm, we don't want to start at the first node,
    // instead we'll start with the existing queue
    if (!resume) {
        pq.push(0, {
            x: origin.x,
            y: origin.y,
            parent: null,
            weight: 0
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

    return await recursiveAsyncGeneratorRunner(dijkstraGenerator(goal, grid, state), delay);
};

function* dijkstraGenerator(
    goal: Coordinate,
    grid: NodeReferences[][],
    state: MutableRefObject<PathfinderState>
) {
    while (!pq.isEmpty()) {
        const [, current] = pq.pop() || [];

        if (!current) continue;

        if (current.x === goal.x && current.y === goal.y) {
            return current;
        }

        if (state.current === PathfinderState.PAUSED) {
            return;
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
                const weight = grid[y]![x]!.weight.current[0];

                pq.push(weight || 0, {
                    x,
                    y,
                    parent: current,
                    weight
                });
            }
        }

        yield;
    }
}
