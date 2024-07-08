import type { MutableRefObject } from 'react';
import type { BFSDirection } from './direction';
import type { Coordinate, Entry } from '../../../../util/type';
import {
    setupPathfinder,
    markNode,
    recursiveAsyncGeneratorRunner,
    isObstruction,
    isOutOfBounds
} from '../../../../util';
import { Directions } from './direction';
import type { Direction, Grid } from '../../type';
import { PathfinderState, State } from '../../type';
// import { abc } from '../../component/Grid';
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
// const visited: boolean[][] = [];

export const resetBFS = (callback: () => void) => {
    queue = [];
    callback();
};

export const beginBFS: BeginBFS = async ({ grid, delay, state, resume, options }) => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    const { direction } = options;

    directions = Directions[direction];

    setupPathfinder(
        queue,
        {
            x: renderer.origin.x,
            y: renderer.origin.y,
            parent: null
        },
        grid,
        resume
    );

    return await recursiveAsyncGeneratorRunner(bfsGenerator(grid, state), delay);
};

function* bfsGenerator(
    grid: Grid,
    state: MutableRefObject<State>
) {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    while (queue.length > 0) {
        const current = queue.shift()!;

        const node = renderer?.getNodeAtIndex(current.x, current.y);

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
            const x = current.x + dx;
            const y = current.y + dy;

            const adjacentNode = renderer.getNodeAtIndex(x, y);

            if (!adjacentNode) {
                continue;
            }

            if (!adjacentNode.isVisited && !adjacentNode.isObstruction) {
                queue.push({
                    x,
                    y,
                    parent: current
                });
            }
        }

        yield;
    }

    return null;
}
