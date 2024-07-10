import type { MutableRefObject } from 'react';

/**
 * The amount of nodes in a column or row.
 */
export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
}

/**
 * The delay between steps of the algorithm visualizer.
 */
export const enum Delay {
    MIN = 1,
    DEFAULT = 50,
    MAX = 1000
}

export type Resolution = {
    x: number,
    y: number
};

/**
 * A tuple describing a pair of directions relative to the current node.
 */
export type Direction = [number, number];

export const enum NodeColor {
    OUTLINE = 'rgb(127, 127, 127)',
    HIGHLIGHT = 'rgb(138, 24, 219)',
    BACKTRACE = 'orange',
    ORIGIN = 'rgb(32, 200, 80)',
    TARGET = 'rgb(30, 128, 230)',
    VISITED = '#75c6af',
    OBSTRUCTION = 'rgb(30, 30, 30)',
    DEFAULT = 'rgb(230, 230, 230)'
}

export enum PathfinderState {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused',
    // DONE = 'done'
}

export type Grid = Node[][];

export type ObstructionGeneratorOptions<T> = {
    delay: MutableRefObject<number>,
    options: T
};

export type ObstructionGenerator<T = void> = (options: ObstructionGeneratorOptions<T>) => boolean | void;
export type AsyncObstructionGenerator<T = void> = (options: ObstructionGeneratorOptions<T>) => Promise<boolean | void>;

// export type RunAction = <T>(action: () => Promise<T>) => Promise<void>;
export enum State {
    IDLE = 'idle',
    OBSTRUCTION_GENERATOR = 'obstruction generator',
    OBSTRUCTION_GENERATOR_PAUSED = 'obstruction generator paused',
    PATHFINDER = 'pathfinder',
    PATHFINDER_PAUSED = 'pathfinder paused',
    PATHFINDER_CONTINUE = 'pathfinder continue',
}

export type RunAction = (action: State) => Promise<void>;

export type Coordinate = {
    x: number,
    y: number
};

export type Entry<T = object> = (Coordinate & {
    parent: Entry
} & T) | null;

export type ValueOf<T> = T[keyof T];

export const enum MouseButton {
    NONE,
    LEFT,
    RIGHT
}


