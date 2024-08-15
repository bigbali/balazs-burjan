import type {
    GeneratorRunner
} from '../../../util';
import {
    setupPathfinder,
    generatorRunner,
    pause
} from '../../../util';
import type { Paused } from '../../../type';
import { State, type Direction, type Entry } from '../../../type';
import { usePathfinderRendererStore } from '../../hook/usePathfinderRenderer';
import usePathfinderStore from '../../hook/usePathfinderStore';
import type { BidirectionalOptions } from './options';
import { BFSDirection } from './options';
import { BreadthFirstSearchInstanced } from '../bfs';

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

type BidirectionalSearchParams = {
    options: BidirectionalOptions
};

export default class BidirectionalSearch {
    static readonly directions = {
        [BFSDirection.ORTHOGONAL]: orthogonal,
        [BFSDirection.DIAGONAL]: diagonal,
        [BFSDirection.HYBRID]: hybrid
    } as const;

    static queue: Entry[] = [];

    static bfs1?: BreadthFirstSearchInstanced;
    static bfs2?: BreadthFirstSearchInstanced;

    static intersection(a: BreadthFirstSearchInstanced, b: BreadthFirstSearchInstanced) {
        for (const aNode of a.queue) {
            for (const bNode of b.queue) {
                if (aNode?.node === bNode?.node) {
                    return true;
                }
            }
        }
    }

    static begin = async (params: BidirectionalSearchParams, resume?: boolean): Promise<Entry | Paused> => {
        this.bfs1 = new BreadthFirstSearchInstanced();
        this.bfs2 = new BreadthFirstSearchInstanced();

        // @ts-ignore so we can deploy on vercel
        return await generatorRunner(this.run(this.bfs1!, this.bfs2!, params, resume));
    };

    static reset (callback?: () => void)  {
        usePathfinderStore.getState().setPathfinderState(State.IDLE);
        this.queue.clear();
        this.bfs1?.reset();
        this.bfs2?.reset();
        callback && callback();
    }

    static  *run(a: BreadthFirstSearchInstanced, b: BreadthFirstSearchInstanced, params: BidirectionalSearchParams, resume?: boolean) {
        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        const aGenerator = a.begin(params, renderer.origin);
        const bGenerator = b.begin(params, renderer.target);

        while(!this.intersection(a, b)) {
            aGenerator.next();
            bGenerator.next();
            yield;
        }

        if (!a.queue.length || !b.queue.length) {
            return null;
        }

        let entryOrigin = b.queue.at(-1);

        while (entryOrigin!.parent) {
            entryOrigin = entryOrigin!.parent;
        }

        entryOrigin!.parent = a.queue.at(-1)!;

        return b.queue.at(-1);
    }
}
