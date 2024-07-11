import type { Direction } from '../../../type';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
}

const BFSOrthogonalDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] as const satisfies Direction[];

const BFSDiagonalDirections = [
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
] as const satisfies Direction[];

const BFSHybridDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
] as const satisfies Direction[];

export const Directions = {
    [BFSDirection.ORTHOGONAL]: BFSOrthogonalDirections,
    [BFSDirection.DIAGONAL]: BFSDiagonalDirections,
    [BFSDirection.HYBRID]: BFSHybridDirections
};
