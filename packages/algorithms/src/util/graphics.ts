import type { NoUndefinedField } from 'util/type';
import type { Coordinate, NodeGrid } from './common';
import { isOutOfBounds } from './common';

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
    origin: Coordinate
};

type NodeCallback = (data: {
    node: NoUndefinedField<Coordinate>,
    grid: NodeGrid,
    depth: number,
    radius: number
}) => void;

const SHAPE_MAP = {
    [Shape.CIRCLE]: circle,
    [Shape.DIAMOND]: diamond
} as const;

function circle(x: number, y: number, radius: number, depth: number, grid: NodeGrid, cb: NodeCallback) {
    // for (let a = x - depth; a <= x + depth; a++) {
    //     for (let b = y - depth; b <= y + depth; b++) {
    //         const distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
    //         if (distance <= depth) {
    //             if (isOutOfBoundsYX(a, b, grid)) continue;
    //             cb({
    //                 node: {
    //                     x: a,
    //                     y: b
    //                 },
    //                 grid
    //             });
    //         }
    //     }
    // }

    let xP = 0;
    let yP = depth;
    let decision = 3 - 2 * depth;

    while (yP >= xP) {
        cb({ node: { x: x + xP, y: y + yP }, grid, depth, radius });
        cb({ node: { x: x + xP, y: y - yP }, grid, depth, radius });
        cb({ node: { x: x - xP, y: y + yP }, grid, depth, radius });
        cb({ node: { x: x - xP, y: y - yP }, grid, depth, radius });
        cb({ node: { x: x + yP, y: y + xP }, grid, depth, radius });
        cb({ node: { x: x + yP, y: y - xP }, grid, depth, radius });
        cb({ node: { x: x - yP, y: y + xP }, grid, depth, radius });
        cb({ node: { x: x - yP, y: y - xP }, grid, depth, radius });
        xP++;
        if (decision <= 0) {
            decision = decision + 4 * xP + 6;
        } else {
            yP--;
            decision = decision + 4 * (xP - yP) + 10;
        }
    }
};

function diamond(x: number, y: number, radius: number, depth: number, grid: NodeGrid, cb: NodeCallback) {
    for (let a = x - depth; a <= x + depth; a++) {
        for (let b = y - depth; b <= y + depth; b++) {
            if (Math.abs(x - a) + Math.abs(y - b) <= depth) {
                if (isOutOfBounds(a, b, grid)) continue;
                cb({
                    node: {
                        x: a,
                        y: b
                    },
                    grid,
                    depth,
                    radius
                });
            }
        }
    }
};

const setColor: NodeCallback = ({ node: { x, y }, grid, depth, radius }) => {
    const node = grid[y]![x]!;

    // The closer we are to the maximum radius, the redder the color is
    const r = depth / radius * 255;

    node.current.style.backgroundColor = `rgb(${r}, 0, 0)`;
};

export const setColor2 = ({ node: { x, y }, grid }: { node: { x: number, y: number }, grid: NodeGrid }) => {
    const node = grid[y]![x]!;

    node.current.style.backgroundColor = 'purple';
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
    if (isOutOfBounds(x, y, grid)) return;

    SHAPE_MAP[shape](x, y, radius, depth, grid, setColor);

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

