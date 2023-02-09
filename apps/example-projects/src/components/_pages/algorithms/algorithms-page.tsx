import type { Dispatch, SetStateAction } from 'react';
import { startTransition } from 'react';
import { memo } from 'react';
import React, { useMemo, useRef, useState } from 'react';

const DEFAULT_COLUMNS = 20;
const DEFAULT_ROWS = 20;
const MIN_COLUMNS = 5;
const MIN_ROWS = 5;
const MAX_COLUMNS = 150;
const MAX_ROWS = 150;

type Coordinate = {
    x: number | null,
    y: number | null
};

type CoordinateProps = {
    x: number,
    y: number,
    origin: Coordinate,
    goal: Coordinate,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>
};

const Coordinate = memo(function Coordinate({
    x,
    y,
    origin,
    goal,
    setOrigin,
    setGoal
}: CoordinateProps) {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const isOrigin = x === origin.x && y === origin.y;
    const isGoal = x === goal.x && y === goal.y;

    return (
        <div
            ref={ref}
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

const Algorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [origin, setOrigin] = useState<Coordinate>({
        x: null,
        y: null
    });
    const [goal, setGoal] = useState<Coordinate>({
        x: null,
        y: null
    });

    const table = useMemo(() => {
        const elements = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                elements.push(
                    <Coordinate
                        key={`${x},${y}`}
                        x={x}
                        y={y}
                        origin={origin}
                        setOrigin={setOrigin}
                        goal={goal}
                        setGoal={setGoal}
                    />
                );
            }
        }

        return elements;
    }, [columns, rows, origin, goal]);

    return (
        <div>
            <h1>
                Algorithms
            </h1>
            <label htmlFor='columns'>
                Columns
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
                Rows
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
