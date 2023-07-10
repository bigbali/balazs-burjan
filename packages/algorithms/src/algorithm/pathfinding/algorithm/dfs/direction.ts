import type { Direction } from '../../direction';

// TODO
export enum DFSDirection {
    TBLR = 'Downwards, Rightwards',
    TBRL = 'top to bottom, right to left',
    BTLR = 'bottom to top, left to right',
    BTRL = 'bottom to top, right to left'
};

const DFSTopToBottomLeftToRight = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];

const DFSTopToBottomRightToLeft = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1]
] satisfies Direction[];

const DFSBottomToTopLeftToRight = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1]
] satisfies Direction[];

const DFSBottomToTopRightToLeft = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
] satisfies Direction[];

export const Directions = {
    [DFSDirection.TBLR]: DFSTopToBottomLeftToRight,
    [DFSDirection.TBRL]: DFSTopToBottomRightToLeft,
    [DFSDirection.BTLR]: DFSBottomToTopLeftToRight,
    [DFSDirection.BTRL]: DFSBottomToTopRightToLeft
};
