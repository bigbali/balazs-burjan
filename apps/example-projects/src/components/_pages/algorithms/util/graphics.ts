import type { MutableRefObject } from 'react';
import type { NoUndefinedField } from 'util/type';

export type Coordinates = {
    x: number | null,
    y: number | null
};

export type NodeRef = MutableRefObject<HTMLDivElement>;
export type NodeGrid = NodeRef[][];

export enum Shape {
    CIRCLE = 'circle',
    DIAMOND = 'diamond'
};

export type PaintOptions = {
    radius: number,
    velocity: number,
    depth: number,
    shape: Shape,
    grid: NodeGrid,
    origin: Coordinates
};

type NodeCallback = (data: {
    node: NoUndefinedField<Coordinates>,
    grid: NodeGrid
}) => void;

const SHAPE_MAP = {
    [Shape.CIRCLE]: circle,
    [Shape.DIAMOND]: diamond
} as const;

const isOutOfBoundsYX = (x: number, y: number, grid: any[][]) => {
    if (y >= grid.length || y < 0) return true;
    if (x >= grid[0]!.length || x < 0) return true;

    return false;
};

function circle(x: number, y: number, depth: number, grid: NodeGrid, cb: NodeCallback) {
    for (let a = x - depth; a <= x + depth; a++) {
        for (let b = y - depth; b <= y + depth; b++) {
            const distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
            if (distance <= depth) {
                if (isOutOfBoundsYX(a, b, grid)) continue;
                cb({
                    node: {
                        x: a,
                        y: b
                    },
                    grid
                });
            }
        }
    }
};

function diamond(x: number, y: number, depth: number, grid: NodeGrid, cb: NodeCallback) {
    for (let a = x - depth; a <= x + depth; a++) {
        for (let b = y - depth; b <= y + depth; b++) {
            if (Math.abs(x - a) + Math.abs(y - b) <= depth) {
                if (isOutOfBoundsYX(a, b, grid)) continue;
                cb({
                    node: {
                        x: a,
                        y: b
                    },
                    grid
                });
            }
        }
    }
};

const setColor: NodeCallback = ({ node: { x, y }, grid }) => {
    const node = grid[y]![x]!;

    node.current.style.backgroundColor = 'yellow';
};

const paint = ({
    radius,
    velocity,
    depth,
    grid,
    shape,
    origin: {
        x,
        y
    }
}: PaintOptions
) => {
    if (depth > radius) return;
    if (x === null || y === null) return;
    if (isOutOfBoundsYX(x, y, grid)) return;

    SHAPE_MAP[shape](x, y, depth, grid, setColor);

    setTimeout(
        () => paint({
            depth: depth + 1,
            radius,
            velocity,
            shape,
            grid,
            origin: {
                x,
                y
            }
        }),
        100 / velocity * 50
    );
};

export const beginPaint = (options: Omit<PaintOptions, 'depth'>) => {
    paint({ ...options, depth: 1 });
};

