import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
import { setupPathfinder } from '../../../../util/common';
import { mutateNode } from '../../../../util/common';
import { recursiveAsyncGeneratorRunner } from '../../../../util/common';
import { isObstruction, isOutOfBounds } from '../../../../util/common';
import type { Direction } from '../../direction';
import { PathfinderState } from '../../state';
import type { DFSDirection } from './direction';
import { Directions } from './direction';

type BeginDFSParams = {
    origin: Coordinate,
    goal: Coordinate,
    grid: NodeReferences[][],
    delay: MutableRefObject<number>,
    state: MutableRefObject<PathfinderState>,
    resume: boolean,
    options: {
        direction: DFSDirection
    }
};

export type BeginDFS = (params: BeginDFSParams) => Promise<DFSStackEntry | undefined>;

type DFSStackEntry = Coordinate & {
    parent: null | DFSStackEntry
};

type DFSStack = DFSStackEntry[];

let stack: DFSStack = [];
let directions: Direction[] = [];
const visited: boolean[][] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};

export const beginDFS: BeginDFS = async ({ origin, goal, grid, delay, state, resume, options }) => {
    const { direction } = options;

    directions = Directions[direction];

    setupPathfinder(
        stack,
        {
            x: origin.x,
            y: origin.y,
            parent: null
        },
        grid,
        visited,
        resume
    );

    return await recursiveAsyncGeneratorRunner(dfsGenerator(goal, grid, state), delay);
};

function* dfsGenerator(
    goal: Coordinate,
    grid: NodeReferences[][],
    state: MutableRefObject<PathfinderState>
) {
    while (stack.length > 0) {
        if (state.current === PathfinderState.PAUSED) {
            return;
        }

        const current = stack.pop()!;

        if (current.x === goal.x && current.y === goal.y) {
            return current;
        }

        if (visited[current.y]![current.x]) {
            continue;
        }

        const setVisited = mutateNode(grid, visited, current.x, current.y);

        if (isObstruction(current.x, current.y, grid)) {
            continue;
        }

        setVisited();

        for (const [dx, dy] of directions) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (!isOutOfBounds(x, y, grid) && !visited[y]![x] && !isObstruction(x, y, grid)) {
                stack.push({
                    x,
                    y,
                    parent: current
                });
            }
        }

        yield;
    }
}
