import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';
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
let visited: boolean[][] = [];

export const resetDFS = (callback: () => void) => {
    stack = [];
    callback();
};

export const beginDFS: BeginDFS = async ({ origin, goal, grid, delay, state, resume, options }) => {
    const { direction } = options;

    directions = Directions[direction];

    // if we are resuming the algorithm, we don't want to start at the first node,
    // instead we'll start with the existing queue
    if (!resume) {
        stack.push({
            x: origin.x,
            y: origin.y,
            parent: null
        });
    }

    // if we are resuming, do not reset the visited matrix
    if (!resume) {
        const newVisited: typeof visited = [];
        for (let y = 0; y < grid.length; y++) {
            const row: boolean[] = [];
            newVisited.push(row);

            for (let x = 0; x < grid[0]!.length; x++) {
                row.push(false);
            }
        }

        visited = newVisited;
    }

    const generator = DFSStep(goal, grid, state);
    return await DFS(generator, delay);
};

type DFSRunner = (
    bfs: Generator<undefined, DFSStackEntry | undefined, unknown>,
    delay: MutableRefObject<number>
) => Promise<DFSStackEntry | undefined>;

const DFS: DFSRunner = async (bfs, delay) => {
    const result = bfs.next();

    if (result.done) {
        return result.value;
    }

    // dark magic, don't touch
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay.current);
    });

    // when this finally resolves, we return the nodes that make up the shortest path
    return await DFS(bfs, delay);
};

function* DFSStep(
    goal: Coordinate,
    grid: NodeReferences[][],
    state: MutableRefObject<PathfinderState>
) {
    while (stack.length > 0) {
        const current = stack.pop()!;

        if (current.x === goal.x && current.y === goal.y) {
            return current;
        }

        if (state.current === PathfinderState.PAUSED) {
            // if pausing, put this node back on top of the stack
            // so when we continue, we just pop it off
            stack.push(current);
            return;
        }

        if (visited[current.y]![current.x]) {
            continue;
        }

        const {
            setIsVisited: {
                current: setIsVisited
            },
            setIsHighlighted
        } = grid[current.y]![current.x]!;

        setIsHighlighted.current(true);
        setTimeout(() => setIsHighlighted.current(false), 200);

        if (isObstruction(current.x, current.y, grid)) {
            continue;
        }

        setIsVisited(true);
        visited[current.y]![current.x] = true;

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
