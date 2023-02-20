// @ts-nocheck
/* eslint-disable */
import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import { PathfinderState } from '../../state';
// import { PriorityQueue } from '../../priorityQueue';

type BeginDijkstraParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
};

export type BeginDijkstra = (params: BeginDijkstraParams) => Promise<DijkstraQueueEntry | undefined>;

type DijkstraQueueEntry = Coordinate & {
    cost: number,
    parent: null | DijkstraQueueEntry,
};

type DijkstraQueue = PriorityQueue<DijkstraQueueEntry>;

let heap: PriorityQueue;
let visited: boolean[][] = [];

export const resetDijkstra = (callback: () => void) => {
    // heap = new PriorityQueue<DijkstraQueueEntry>((a, b) => a.cost < b.cost);
    callback();
};

export const beginDijkstra: BeginDijkstra = async ({ origin, goal, grid, delay, state }) => {
    // heap = new PriorityQueue<DijkstraQueueEntry>((a, b) => a.cost < b.cost);
    visited = [];

    for (let y = 0; y < grid.length; y++) {
        const row: boolean[] = [];
        visited.push(row);

        for (let x = 0; x < grid[0]!.length; x++) {
            row.push(false);
        }
    }

    heap.push({
        x: origin.x,
        y: origin.y,
        cost: 0,
        parent: null
    });

    const generator = DijkstraStep(goal, grid, visited, state);
    return await Dijkstra(generator, delay);
};

type DijkstraRunner = (
    dijkstra: Generator<undefined, DijkstraQueueEntry | undefined, unknown>,
    delay: MutableRefObject<number>
) => Promise<DijkstraQueueEntry | undefined>;

const Dijkstra: DijkstraRunner = async (dijkstra, delay) => {
    const result = dijkstra.next();

    if (result.done) {
        return result.value;
    }

    // dark magic, don't touch
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay.current);
    });

    // when this finally resolves, we return the nodes that make up the shortest path
    return await Dijkstra(dijkstra, delay);
};

function* DijkstraStep(
    goal: Coordinate,
    grid: NodeReferences[][],
    visited: boolean[][],
    state: MutableRefObject<PathfinderState>
) {
    while (!heap.isEmpty()) {
        const current = heap.pop()!;

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

        // for (const [dx, dy] of [[-1, 0], [0
    }
}