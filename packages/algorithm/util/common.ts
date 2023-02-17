import type { MutableRefObject } from 'react';
import type { Nodes2 } from '../algorithm/pathfinding';

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

export const isObstruction = (x: number, y: number, grid: Nodes2[][]) => {
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
