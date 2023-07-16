import type { ForwardedState } from '../../util/type';

/**
 * The amount of nodes in a column or row.
 */
export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
};

/**
 * The delay between steps of the algorithm visualizer.
 */
export const enum Delay {
    MIN = 1,
    DEFAULT = 50,
    MAX = 1000
};

/**
 * References to the state and state setters of a node.
 */
export type Node = {
    visited: ForwardedState<boolean>,
    active: ForwardedState<boolean>,
    backtrace: ForwardedState<boolean>,
    obstruction: ForwardedState<boolean>,
    weight: ForwardedState<number | null>,
    reset: (() => void)
};

export const enum NodeColor {
    OUTLINE = 'rgb(127, 127, 127)',
    HIGHLIGHT = 'orange',
    HIGHLIGHT_SELECTED = 'rgb(255, 0, 89)',
    HIGHLIGHT_BACKTRACE = 'rgb(138, 24, 219)',
    ORIGIN = 'rgb(32, 200, 80)',
    TARGET = 'rgb(30, 128, 230)',
    VISITED = 'rgb(190, 210, 210)',
    OBSTRUCTION = 'rgb(30, 30, 30)',
    DEFAULT = 'rgb(230, 230, 230)',
};

export enum PathfinderState {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused',
    // DONE = 'done'
};

export type Grid = Node[][];
