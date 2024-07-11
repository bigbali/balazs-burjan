import type { MutableRefObject } from 'react';
import type { BFSDirection } from '../bfs/direction';
import { PriorityQueue } from './priority-queue';
import {
    setupPathfinder,
    generatorRunner
} from '../../../util';
import type { Coordinate, Entry } from '../../../type';
import type { Direction, Grid } from '../../../type';
import { State } from '../../../type';
import { useRendererStore } from '../../hook/useRenderer';

type BeginDijkstraParams = {
    origin: Coordinate,
    target: Coordinate,
    grid: Grid,
    delay: MutableRefObject<number>,
    state: MutableRefObject<State>,
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
] as const satisfies Direction[];

export const resetDijkstra = (callback: () => void) => {
    pq.clear();
    callback();
};

export const beginDijkstra: BeginDijkstra = async ({ delay, state, resume }) => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    setupPathfinder(
        pq,
        [0, {
            node: renderer.origin,
            parent: null
        }],
        resume
    );

    return await generatorRunner(dijkstraGenerator(state), delay);
};

function* dijkstraGenerator(
    state: MutableRefObject<State>
) {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    while (!pq.isEmpty()) {
        const [, current] = pq.pop() || [];

        if (!current) continue;

        const node = current.node;

        if (node.isTarget) {
            return current;
        }

        if (state.current === State.PATHFINDER_PAUSED) {
            return null;
        }

        if (node.isVisited) {
            continue;
        }

        if (node.isObstruction) {
            continue;
        }

        node.setVisited();

        for (const [dx, dy] of directions) {
            const x = node.x + dx;
            const y = node.y + dy;

            const adjacentNode = renderer.getNodeAtIndex(x, y);

            if (adjacentNode && !adjacentNode.isVisited && !adjacentNode.isObstruction) {
                const weight = adjacentNode.weight;

                pq.push(weight ?? 0, {
                    node: adjacentNode,
                    parent: current,
                    weight
                });
            }
        }

        yield;
    }

    return null;
}
