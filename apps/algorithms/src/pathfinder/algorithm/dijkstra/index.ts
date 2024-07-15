import type { Entry, Paused } from '../../../type';
import type { Direction } from '../../../type';
import { PriorityQueue } from './priority-queue';
import {
    setupPathfinder,
    generatorRunner,
    pause
} from '../../../util';
import { State } from '../../../type';
import { useRendererStore } from '../../hook/useRenderer';
import usePathfinderStore from '../../../renderer/usePathfinderStore';

type DijkstraEntry = Entry<{ weight: number | null }>;

type DijkstraParams = {
    resume: boolean
};

export default class Dijkstra {
    static readonly directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ] as const satisfies Direction[];

    static priorityQueue = new PriorityQueue();

    static begin = async ({ resume }: DijkstraParams): Promise<DijkstraEntry | Paused> => {
        const renderer = useRendererStore.getState().renderer;

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
        usePathfinderStore.getState().setState(State.IDLE);
        this.priorityQueue.clear();
        callback && callback();
    }

    static *run() {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        while (!this.priorityQueue.isEmpty()) {
            const [, current] = this.priorityQueue.pop() || [];

            if (!current) continue;

            const node = current.node;

            const state = usePathfinderStore.getState().state;

            if (state === State.PATHFINDER_PAUSED) {
                return pause();
            } else if (state === State.IDLE) {
                return null;
            }

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
