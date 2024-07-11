import type { MutableRefObject } from 'react';
import type { BFSDirection } from './direction';
import type { Coordinate, Entry } from '../../../type';
import {
    setupPathfinder,
    generatorRunner
} from '../../../util';
import { Directions } from './direction';
import type { Direction, Grid } from '../../../type';
import { State } from '../../../type';
import { useRendererStore } from '../../hook/useRenderer';

type BeginBFSParams = {
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

export type BeginBFS = (params: BeginBFSParams) => Promise<Entry | null>;

let queue: Entry[] = [];
let directions: Direction[] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async ({ delay, state, resume, options }) => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    directions = Directions[options.direction];

    setupPathfinder(
        queue,
        {
            node: renderer.origin,
            parent: null
        },
        resume
    );

    return await generatorRunner(bfsGenerator(state), delay);
};

function* bfsGenerator(state: MutableRefObject<State>) {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    while (queue.length > 0) {
        const current = queue.shift()!;
        const node = current.node;

        if (state.current === State.PATHFINDER_PAUSED) {
            return current;
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
                queue.push({
                    node: adjacentNode,
                    parent: current
                });
            }
        }

        yield;
    }

    return null;
}
