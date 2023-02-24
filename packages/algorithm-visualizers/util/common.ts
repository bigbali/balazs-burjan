import type { MutableRefObject } from 'react';
import type { NodeReferences } from '../algorithm/pathfinding';

export type Coordinate = {
    x: number,
    y: number
};

export type NodeRef = MutableRefObject<HTMLDivElement>;
export type NodeGrid = NodeRef[][];

export const isOutOfBounds = (x: number, y: number, grid: any[][]) => {
    if (y >= grid.length || y < 0) return true;
    if (x >= grid[0]!.length || x < 0) return true;

    return false;
};

export const isObstruction = (x: number, y: number, grid: NodeReferences[][]) => {
    const {
        obstruction: {
            current: [
                isObstruction
            ]
        }
    } = grid[y]![x]!;

    return isObstruction;
};

type ForEachNode = <T>(
    grid: T[][],
    callback: (node: T) => void
) => void;

export const forEachNode: ForEachNode = (grid, callback) => {
    for (let row = 0; row < grid.length; row++) {
        for (let column = 0; column < grid[0]!.length; column++) {
            callback(grid[row]![column]!);
        }
    }
};

type RecursiveAsyncGeneratorRunner = <T>(
    generator: Generator<unknown, T, unknown>,
    delay: MutableRefObject<number>
) => Promise<T>;

/**
 * A generator runner that recursively calls itself.
 * @param generator
 * @param delay - a ref object that contains a number
 * @returns the result of the generator
 */
export const recursiveAsyncGeneratorRunner: RecursiveAsyncGeneratorRunner = async (generator, delay) => {
    const result = generator.next();

    if (result.done) {
        return result.value;
    }

    // dark magic, don't touch
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay.current);
    });

    return await recursiveAsyncGeneratorRunner(generator, delay);
};

type MutateNode = (
    grid: NodeReferences[][],
    visited: boolean[][],
    x: number,
    y: number
) => () => void;

/**
 * Updates the highlight state of the node at `grid[y][x]`
 * @returns a function to that sets the state of the node and updates the visited matrix
 */
export const mutateNode: MutateNode = (grid, visited, x, y) => {
    const {
        setIsVisited: {
            current: setIsVisited
        },
        setIsHighlighted
    } = grid[y]![x]!;

    setIsHighlighted.current(true);
    setTimeout(() => setIsHighlighted.current(false), 200);

    return () => {
        setIsVisited(true);
        visited[y]![x] = true;
    };
};

type SetupPathfinder = <T>(
    entries: {
        push: (...args: any[]) => any
    },
    initialEntry: T,
    grid: NodeReferences[][],
    visited: boolean[][],
    resume: boolean
) => void;

export const setupPathfinder: SetupPathfinder = (entries, initialEntry, grid, visited, resume) => {
    if (!resume) {
        Array.isArray(initialEntry)
            ? entries.push(...initialEntry)
            : entries.push(initialEntry);
    }

    // if we are resuming, do not reset the visited matrix
    if (!resume) {
        visited.length = 0;
        for (let y = 0; y < grid.length; y++) {
            const row: boolean[] = [];
            visited.push(row);

            for (let x = 0; x < grid[0]!.length; x++) {
                row.push(false);
            }
        }
    }
};
