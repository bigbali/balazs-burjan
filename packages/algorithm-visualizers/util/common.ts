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
        isObstruction: {
            current: isObstruction
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
