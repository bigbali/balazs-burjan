import type { Entry, Paused } from '../../../type';
import type { Direction } from '../../../type';
import { PriorityQueue } from './priority-queue';
import {
    setupPathfinder,
    generatorRunner,
    pause
} from '../../../util';
import { State } from '../../../type';
import { usePathfinderRendererStore } from '../../hook/usePathfinderRenderer';
import usePathfinderStore from '../../hook/usePathfinderStore';
import type { DijkstraOptions } from './options';

type DijkstraEntry = Entry<{ weight: number | null }>;

type DijkstraParams = {
    options: DijkstraOptions
};

export default class Dijkstra {
    static readonly directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ] as const satisfies Direction[];

    static priorityQueue = new PriorityQueue();


    static begin = async ({ options }: DijkstraParams, resume?: boolean): Promise<DijkstraEntry | Paused> => {
        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        setupPathfinder(
            this.priorityQueue,
            [0, {
                node: renderer.origin,
                parent: null
            }],
            resume
        );

        return await generatorRunner(this.run());
    };

    static reset (callback?: () => void)  {
        usePathfinderStore.getState().setPathfinderState(State.IDLE);
        this.priorityQueue.clear();
        callback && callback();
    }

    static *run() {
        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        while (!this.priorityQueue.isEmpty()) {
            const state = usePathfinderStore.getState().pathfinderState;

            if (state === State.PAUSED) {
                return pause();
            } else if (state === State.IDLE) {
                return null;
            }

            const [, current] = this.priorityQueue.pop() || [];

            if (!current) continue;

            const node = current.node;

            if (node.isTarget) {
                return current;
            }

            if (node.isVisited) {
                continue;
            }

            if (node.isObstruction) {
                continue;
            }

            node.setVisited();

            for (const [dx, dy] of this.directions) {
                const x = node.x + dx;
                const y = node.y + dy;

                const adjacentNode = renderer.getNodeAtIndex(x, y);

                if (adjacentNode && !adjacentNode.isVisited && !adjacentNode.isObstruction) {
                    const weight = adjacentNode.weight;

                    this.priorityQueue.push(weight ?? 0, {
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
}
