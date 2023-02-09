import type { Dispatch, Ref, SetStateAction } from 'react';
import { createRef } from 'react';
import { startTransition } from 'react';
import { memo } from 'react';
import React, { useMemo, useState } from 'react';

const DEFAULT_COLUMNS = 20;
const DEFAULT_ROWS = 20;
const DEFAULT_VELOCITY = 5;
const DEFAULT_RADIUS = 9;

const MIN_COLUMNS = 5;
const MIN_ROWS = 5;
const MIN_VELOCITY = 1;
const MIN_RADIUS = 1;


const MAX_COLUMNS = 150;
const MAX_ROWS = 150;
const MAX_VELOCITY = 100;
const MAX_RADIUS = 100;

type Coordinate = {
    x: number | null,
    y: number | null
};

type CoordinateProps = {
    x: number,
    y: number,
    isOrigin: boolean,
    isGoal: boolean,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>,
    gridRef: Ref<HTMLDivElement>
};

const Coordinate = memo(function Coordinate({
    x,
    y,
    gridRef,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal
}: CoordinateProps) {
    const [isShowMenu, setIsShowMenu] = useState(false);

    return (
        <div
            ref={gridRef}
            onClick={() => setIsShowMenu(state => !state)}
            className={
                `aspect-square border bg-slate-500 relative
                ${isOrigin ? '!bg-sky-800' : ''}
                ${isGoal ? '!bg-green-700' : ''}`
            }
            style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1
            }}
        >
            {isShowMenu && (
                <div className='absolute bottom-full bg-yellow-500 p-4'>
                    <button
                        className='bg-sky-800 text-white px-4 py-2 border-none'
                        onClick={() => startTransition(() => setOrigin({ x, y }))}
                    >
                        Set as Starting Point
                    </button>
                    <button
                        className='bg-green-700 text-white px-4 py-2 border-none'
                        onClick={() => startTransition(() => setGoal({ x, y }))}
                    >
                        Set as Goal Point
                    </button>
                </div>
            )}
        </div>
    );
});

const isOutOfBoundsYX = (x: number, y: number, grid: any[][]) => {
    if (y >= grid.length || y < 0) return true;
    if (x >= grid[0]!.length || x < 0) return true;

    return false;
};

const circle = (x: number, y: number, depth: number, grid: any[][], cb: (a: number, b: number) => void) => {
    for (let a = x - depth; a <= x + depth; a++) {
        for (let b = y - depth; b <= y + depth; b++) {
            const distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
            if (distance <= depth) {
                if (isOutOfBoundsYX(a, b, grid)) continue;
                cb(a, b);
            }
        }
    }
};

const diamond = (x: number, y: number, depth: number, grid: any[][], cb: (a: number, b: number) => void) => {
    for (let a = x - depth; a <= x + depth; a++) {
        for (let b = y - depth; b <= y + depth; b++) {
            if (Math.abs(x - a) + Math.abs(y - b) <= depth) {
                if (isOutOfBoundsYX(a, b, grid)) continue;
                cb(a, b);
            }
        }
    }
};

enum Shape {
    CIRCLE = 'circle',
    DIAMOND = 'diamond'
};

const shapeMap = {
    [Shape.CIRCLE]: circle,
    [Shape.DIAMOND]: diamond
};

const Algorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [velocity, setVelocity] = useState(() => DEFAULT_VELOCITY);
    const [radius, setRadius] = useState(() => DEFAULT_RADIUS);
    const [shape, setShape] = useState(() => Shape.CIRCLE);

    const [origin, setOrigin] = useState<Coordinate>({
        x: null,
        y: null
    });
    const [goal, setGoal] = useState<Coordinate>({
        x: null,
        y: null
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
    const yx: Ref<HTMLDivElement>[][] = Array(rows).fill(null).map(() => Array(columns).fill(null));

    if (global !== undefined) {
        //@ts-ignore
        global.xy = yx;
    }

    const paint = ({ x, y }: Coordinate, depth: number) => {
        if (depth >= radius) return;
        if (x === null || y === null) return;
        if (isOutOfBoundsYX(x, y, yx)) return;

        const setColor = (x: number, y: number) => {
            //@ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (yx[y]![x] as Ref<HTMLDivElement>).current.style.backgroundColor = 'yellow';
        };

        shapeMap[shape](x, y, depth, yx, setColor);

        setTimeout(() => paint({ x, y }, depth + 1), 100 / velocity * 50);
    };

    const initiate = () => {
        paint(origin, 0);
    };

    const table = useMemo(() => {
        const elements = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const ref = createRef<HTMLDivElement>();

                yx[y]![x] = ref;

                elements.push(
                    <Coordinate
                        key={`${x},${y}`}
                        x={x}
                        y={y}
                        isOrigin={x === origin.x && y === origin.y}
                        setOrigin={setOrigin}
                        isGoal={x === goal.x && y === goal.y}
                        setGoal={setGoal}
                        gridRef={ref}
                    />
                );
            }
        }

        return elements;
    }, [yx, rows, columns, origin.x, origin.y, goal.x, goal.y]);

    return (
        <div>
            <h1>
                Algorithms
            </h1>
            <label htmlFor='columns'>
                Columns {columns}
            </label>
            <input
                type='range'
                id='columns'
                max={MAX_COLUMNS}
                min={MIN_COLUMNS}
                step={1}
                value={columns}
                onChange={(e) => startTransition(() => setColumns(Number.parseInt(e.currentTarget.value)))}
            />
            <label htmlFor='rows'>
                Rows {rows}
            </label>
            <input
                type='range'
                id='rows'
                max={MAX_ROWS}
                min={MIN_ROWS}
                step={1}
                value={rows}
                onChange={(e) => startTransition(() => setRows(Number.parseInt(e.currentTarget.value)))}
            />
            <label htmlFor='velocity'>
                Velocity {velocity}
            </label>
            <input
                type='range'
                id='velocity'
                max={MAX_VELOCITY}
                min={MIN_VELOCITY}
                step={1}
                value={velocity}
                onChange={(e) => startTransition(() => setVelocity(Number.parseInt(e.currentTarget.value)))}
            />
            <label htmlFor='radius'>
                Radius {radius}
            </label>
            <input
                type='range'
                id='radius'
                max={MAX_RADIUS}
                min={MIN_RADIUS}
                step={1}
                value={radius}
                onChange={(e) => startTransition(() => setRadius(Number.parseInt(e.currentTarget.value)))}
            />
            <label htmlFor='shape'>
                Shape {shape}
            </label>
            <select
                id='shape'
                className='capitalize border border-black'
                value={shape}
                onChange={(e) => startTransition(() => setShape(e.currentTarget.value as Shape))}
            >
                {Object.values(Shape).map((value) => {
                    return (
                        <option key={value} value={value} className='capitalize'>
                            {value}
                        </option>
                    );
                })}
            </select>
            <button onClick={initiate}>
                Initiate
            </button>
            <div
                className='px-64 py-32'
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    height: '100%'
                }}>
                {table}
            </div>
        </div>
    );
};

export default Algorithms;
