import type { Direction } from '../../direction';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
};
export const BFSOrthogonalDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]satisfies Direction[];

export const BFSDiagonalDirections = [
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
]satisfies Direction[];

export const BFSHybridDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
]satisfies Direction[];

export const Directions = {
    [BFSDirection.ORTHOGONAL]: BFSOrthogonalDirections,
    [BFSDirection.DIAGONAL]: BFSDiagonalDirections,
    [BFSDirection.HYBRID]: BFSHybridDirections
};
