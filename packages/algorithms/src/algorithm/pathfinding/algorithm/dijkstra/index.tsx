import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import type { Direction } from '../../direction';
import type { BFSDirection } from '../bfs/direction';
import type { DijkstraQueueEntry } from './priority-queue';
import { PathfinderState } from '../../state';
import { PriorityQueue } from './priority-queue';
import {
    setupPathfinder,
    mutateNode,
    recursiveAsyncGeneratorRunner,
    isObstruction,
    isOutOfBounds
} from '../../../../util/common';
import type { Entry } from '../../../../util/algorithm';


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

type DijkstraEntry = Entry<{ weight: number | null }>;
export type BeginDijkstra = (params: BeginDijkstraParams) => Promise<DijkstraEntry>;

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];

const visited: boolean[][] = [];

export const resetDijkstra = (callback: () => void) => {
    pq.clear();
    callback();
};

export const beginDijkstra: BeginDijkstra = async ({ origin, goal, grid, delay, state, resume }) => {
    setupPathfinder(
        pq,
        [0, {
            x: origin.x,
            y: origin.y,
            parent: null
        }],
        grid,
        visited,
        resume
    );

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
            return null;
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

    return null;
}
