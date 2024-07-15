import type {  Dispatch, MutableRefObject, SetStateAction } from 'react';
import type Node from './renderer/node';

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

export enum Pathfinder {
    BREADTH_FIRST = 'Breadth First Search',
    DEPTH_FIRST = 'Depth First Search',
    DIJKSTRA = 'Dijkstra\'s Algorithm'
}

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

export type ObstructionGeneratorOptions<T> = {
    options: T
};

export type PathfinderResult = {
    entry: Entry
};

export type Paused = {
    paused: true
};

export type ObstructionGenerator<T = void> =
    (options: ObstructionGeneratorOptions<T>, resume: boolean) => boolean | Paused;
export type AsyncObstructionGenerator<T = void> =
    (options: ObstructionGeneratorOptions<T>, resume: boolean) => Promise<boolean | Paused>;

export enum State {
    IDLE = 'idle',
    OBSTRUCTION_GENERATOR_RUNNING = 'obstruction generator running',
    OBSTRUCTION_GENERATOR_PAUSED = 'obstruction generator paused',
    OBSTRUCTION_GENERATOR_RESUMING = 'obstruction generator resuming',
    PATHFINDER_RUNNING = 'pathfinder running',
    PATHFINDER_PAUSED = 'pathfinder paused',
    PATHFINDER_RESUMING = 'pathfinder resuming',
}

export type RunAction = (action: State) => Promise<void>;

export type Coordinate = {
    x: number,
    y: number
};

export type Entry<T = {}> = (({
    node: Node,
    parent: Entry
}) & T) | null;

export type ValueOf<T> = T[keyof T];

export const enum MouseButton {
    NONE,
    LEFT,
    RIGHT
}

export type OptionsComponentProps<T> = {
    options: T,
    setOptions: Dispatch<SetStateAction<T>>
};
