import type { Direction, Entry, Paused } from '../../../type';
import { State } from '../../../type';
import { setupPathfinder, generatorRunner, pause } from '../../../util';
import { usePathfinderRendererStore } from '../../hook/usePathfinderRenderer';
import usePathfinderStore from '../../hook/usePathfinderStore';
import { DFSDirection, type DFSOptions } from './options';

type DepthFirstSearchParams = {
    options: DFSOptions
};

const lrbt = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];

const lrtb = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1]
] satisfies Direction[];

const rlbt = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];

const rltb = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
] satisfies Direction[];

export default class DepthFirstSearch {
    static readonly directions = {
        [DFSDirection.LRBT]: lrbt,
        [DFSDirection.LRTB]: lrtb,
        [DFSDirection.RLBT]: rlbt,
        [DFSDirection.RLTB]: rltb
    } as const;

    static stack: Entry[] = [];

    static begin = async ({ options }: DepthFirstSearchParams, resume: boolean): Promise<Entry | Paused> => {
        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) throw Error('no renderer');


        setupPathfinder(
            DepthFirstSearch.stack,
            {
                node: renderer.origin,
                parent: null
            },
            resume
        );

        return await generatorRunner(this.run(this.directions[options.direction]));
    };

    static reset (callback?: () => void)  {
        usePathfinderStore.getState().setPathfinderState(State.IDLE);
        this.stack.clear();
        callback && callback();
    }

    static *run(directions: Direction[]) {
        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) throw Error('no renderer');

        while (this.stack.length > 0) {
            const current = this.stack.pop()!;
            const node = current.node;

            const state = usePathfinderStore.getState().pathfinderState;

            if (state === State.PAUSED) {
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

            for (const [dx, dy] of directions) {
                const x = node.x + dx;
                const y = node.y + dy;

                const adjacentNode = renderer.getNodeAtIndex(x, y);

                if (adjacentNode && !adjacentNode.isVisited && !adjacentNode.isObstruction) {
                    this.stack.push({
                        node: adjacentNode!,
                        parent: current
                    });
                }
            }

            yield;
        }

        return null;
    }
}
