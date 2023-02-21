import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import { PathfinderState } from '../../state';
import type { BFSDirection } from '../bfs/direction';

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

const pq = new Map<number, DijkstraQueueEntry[]>();

export type BeginDijkstra = (params: BeginDijkstraParams) => Promise<DijkstraQueueEntry | undefined>;

type DijkstraQueueEntry = Coordinate & {
    weight: number,
    parent: null | DijkstraQueueEntry
};

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];
let visited: boolean[][] = [];

export const resetDijkstra = (callback: () => void) => {
    callback();
};

// @ts-ignore
export const beginDijkstra: BeginDijkstra = async ({ origin, goal, grid, delay, state, resume, options }) => {
    // if we are resuming the algorithm, we don't want to start at the first node,
    // instead we'll start with the existing queue
    if (!resume) {
        pq.set(0, [{
            x: origin.x,
            y: origin.y,
            parent: null,
            weight: 0
        }]);
    }

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            const distance = Math.sqrt(Math.pow(goal.y - y, 2) + Math.pow(goal.x - x, 2));
            grid[y]![x]!.weight.current[1](Math.round((distance / grid.length * 255)));
        }
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    // for (let y = 0; y < grid.length; y++) {
    //     for (let x = 0; x < grid[0]!.length; x++) {
    //         // setTimeout(() => console.log(grid[y]![x]!.weight.current[0]), 500);
    //         // console.log(x, y, grid[y]![x]!.weight.current[0]);
    //     }
    // }


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


    const generator = DijkstraStep(goal, grid, visited, state);
    return await Dijkstra(generator, delay);
};

type DijkstraRunner = (
    bfs: Generator<undefined, DijkstraQueueEntry | undefined, unknown>,
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
    let w = 400;
    while (true) {
        let current: DijkstraQueueEntry | undefined;

        for (let i = 0; i < w; i++) {
            const weightedQueue = pq.get(i);
            console.log(weightedQueue);
            if (weightedQueue && weightedQueue.length > 0) {
                current = weightedQueue.shift();
                break;
            } else {
                console.log('no wq');
                continue;
            }
        }

        if (!current) return;

        if (current.x === goal.x && current.y === goal.y) {
            console.log('goal');
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

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x] && !isObstruction(x, y, grid)) {
                const weight = grid[y]![x]!.weight.current[0];
                if (!weight) continue;
                if (weight > w) {
                    w = weight;
                }

                const weightedQueue = pq.get(weight);
                if (!weightedQueue) {
                    pq.set(weight, [{
                        x,
                        y,
                        parent: current,
                        weight
                    }]);

                    continue;
                };

                weightedQueue.push({
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
