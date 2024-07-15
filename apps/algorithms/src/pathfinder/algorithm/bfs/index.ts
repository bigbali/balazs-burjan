import {
    setupPathfinder,
    generatorRunner,
    pause
} from '../../../util';
import type { Paused } from '../../../type';
import { State, type Direction, type Entry } from '../../../type';
import { useRendererStore } from '../../hook/useRenderer';
import usePathfinderStore from '../../../renderer/usePathfinderStore';
import type { BFSOptions } from './options';
import { BFSDirection } from './options';

const orthogonal = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] as const satisfies Direction[];

const diagonal = [
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
] as const satisfies Direction[];

const hybrid = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
] as const satisfies Direction[];

type BreadthFirstSearchParams = {
    resume: boolean,
    options: BFSOptions
};

export default class BreadthFirstSearch {
    static readonly directions = {
        [BFSDirection.ORTHOGONAL]: orthogonal,
        [BFSDirection.DIAGONAL]: diagonal,
        [BFSDirection.HYBRID]: hybrid
    } as const;

    static queue: Entry[] = [];

    static begin = async ({ options, resume }: BreadthFirstSearchParams): Promise<Entry | Paused> => {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        setupPathfinder(
            this.queue,
            {
                node: renderer.origin,
                parent: null
            },
            resume
        );

        return await generatorRunner(this.run(this.directions[options.direction]));
    };

    static reset (callback?: () => void)  {
        usePathfinderStore.getState().setState(State.IDLE);
        this.queue.clear();
        callback && callback();
    }

    static *run(directions: Direction[]) {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        while (BreadthFirstSearch.queue.length > 0) {
            const current = BreadthFirstSearch.queue.shift()!;
            const node = current.node;

            const state = usePathfinderStore.getState().state;

            if (state === State.PATHFINDER_PAUSED) {
                return pause();
            } else if (state === State.IDLE) {
                return null;
            }

            if (node?.isTarget) {
                return current;
            }

            if (node?.isVisited) {
                continue;
            }

            if (node?.isObstruction) {
                continue;
            }

            node?.setVisited();

            for (const [dx, dy] of directions) {
                const x = node.x + dx;
                const y = node.y + dy;

                const adjacentNode = renderer.getNodeAtIndex(x, y);

                if (adjacentNode && !adjacentNode.isVisited && !adjacentNode.isObstruction) {
                    BreadthFirstSearch.queue.push({
                        node: adjacentNode,
                        parent: current
                    });
                }
            }

            yield;
        }

        return null;
    }
}
