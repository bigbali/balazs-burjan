import type { MutableRefObject } from 'react';
import type { DFSDirection } from './direction';
import { Directions } from './direction';
import type { Direction, Entry } from '../../../type';
import { State } from '../../../type';
import { setupPathfinder, generatorRunner } from '../../../util';
import { useRendererStore } from '../../hook/useRenderer';

type BeginDFSParams = {
    delay: MutableRefObject<number>,
    state: MutableRefObject<State>,
    resume: boolean,
    options: {
        direction: DFSDirection
    }
};

export type BeginDFS = (params: BeginDFSParams) => Promise<Entry>;

let stack: Entry[] = [];
let directions: Direction[] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};

export const beginDFS: BeginDFS = async ({ delay, state, resume, options }) => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) throw Error('no renderer');

    directions = Directions[options.direction];

    setupPathfinder(
        stack,
        {
            node: renderer.origin,
            parent: null
        },
        resume
    );

    return await generatorRunner(dfsGenerator(state), delay);
};

function* dfsGenerator(
    state: MutableRefObject<State>
) {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) throw Error('no renderer');

    while (stack.length > 0) {
        if (state.current === State.PATHFINDER_PAUSED) {
            return null;
        }

        const current = stack.pop()!;
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

        for (const [dx, dy] of directions) {
            const x = node.x + dx;
            const y = node.y + dy;

            const adjacentNode = renderer.getNodeAtIndex(x, y);

            if (adjacentNode && !adjacentNode.isVisited && !adjacentNode.isObstruction) {
                stack.push({
                    node: adjacentNode!,
                    parent: current
                });
            }
        }

        yield;
    }

    return null;
}
