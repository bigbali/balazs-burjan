import type { MutableRefObject } from 'react';
import type { Grid, Resolution } from '../type';
import type Node from '../renderer/node';

// export const isOutOfBounds = (x: number, y: number, grid: Grid) => {
//     if (y >= grid.length || y < 0) return true;
//     if (x >= grid[0]!.length || x < 0) return true;

//     return false;
// };

export const isOutOfBounds = (x: number, y: number, resolution: Resolution) => {
    if (x >= resolution.x || x < 0) return true;
    if (y >= resolution.y || y < 0) return true;

    return false;
};

// export const isObstruction = (x: number, y: number, grid: Grid) => {
//     return grid[y]![x]!.obstruction?.[0];
// };

type ForEachNode = <T extends Node>(
    grid: T[][],
    callback: (node: T) => void
) => void;

export const forEachNode: ForEachNode = (grid, callback) => {
    for (const element of grid) {
        for (let column = 0; column < grid[0]!.length; column++) {
            callback(element[column]!);
        }
    }
};

type GeneratorRunner = <T>(
    generator: Generator<unknown, T, unknown>,
    delay: MutableRefObject<number>
) => Promise<T>;

type AsyncGeneratorRunner = <T>(
    generator: AsyncGenerator<unknown, T, unknown>,
    delay: MutableRefObject<number>
) => Promise<T>;

/**
 * A generator runner that recursively calls itself.
 * @param generator
 * @param delay - a ref object that contains a number
 * @returns the result of the generator
 */
export const generatorRunner: GeneratorRunner = async (generator, delay) => {
    const result = generator.next();

    if (result.done) {
        return result.value;
    }

    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), delay.current);
    });

    return await generatorRunner(generator, delay);
};

export const asyncGeneratorRunner: AsyncGeneratorRunner = async (generator, delay) => {
    const result = await generator.next();

    if (result.done) {
        return result.value;
    }

    let timeout: NodeJS.Timeout;
    await new Promise((resolve) => {
        timeout = setTimeout(resolve, delay.current);
    }).then(() => clearTimeout(timeout));

    return await asyncGeneratorRunner(generator, delay);
};

type MarkNode = (
    grid: Grid,
    visited: boolean[][],
    x: number,
    y: number
) => void;

// // TODO could be better, no need to return fn, can move visited to node itself
/**
 * Updates the highlight state of the node at `grid[y][x]`
 * @returns a function to that sets the state of the node and updates the visited matrix
 */
export const markNode: MarkNode = (grid, visited, x, y) => {
    // const {
    //     visited: [, setVisited],
    //     active: [, setHighlighted]
    // } = grid[y]![x]!;

    visited[y]![x] = true;
    // setVisited(true);
    // setHighlighted(true);
    // setTimeout(() => setHighlighted(false), 200);
};

// type SetupPathfinder = <T>(
//     entries: {
//         push: (...args: any[]) => any
//     },
//     initialEntry: T,
//     grid: Grid,
//     visited: boolean[][],
//     resume: boolean
// ) => void;

// TODO wtf?
// export const setupPathfinder: SetupPathfinder = (entries, initialEntry, grid, visited, resume) => {
//     if (!resume) {
//         Array.isArray(initialEntry)
//             ? entries.push(...initialEntry)
//             : entries.push(initialEntry);
//     }

//     // if we are resuming, do not reset the visited matrix
//     if (!resume) {
//         visited.length = 0;
//         for (let y = 0; y < grid.length; y++) {
//             const row: boolean[] = [];
//             visited.push(row);

//             for (let x = 0; x < grid[0]!.length; x++) {
//                 row.push(false);
//             }
//         }
//     }
// };

type SetupPathfinder = <T>(
    entries: {
        push: (...args: any[]) => any;
    },
    initialEntry: T,
    resume: boolean
) => void;


export const setupPathfinder: SetupPathfinder = (entries, initialEntry, resume) => {
    if (!resume) {
        Array.isArray(initialEntry)
            ? entries.push(...initialEntry)
            : entries.push(initialEntry);
    }

    // if we are resuming, do not reset the visited matrix
    // if (!resume) {
    //     visited.length = 0;
    //     for (let y = 0; y < grid.length; y++) {
    //         const row: boolean[] = [];
    //         visited.push(row);

    //         for (let x = 0; x < grid[0]!.length; x++) {
    //             row.push(false);
    //         }
    //     }
    // }
};
