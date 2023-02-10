import type { Dispatch, Ref, SetStateAction } from 'react';
import { createRef } from 'react';
import { startTransition } from 'react';
import { memo } from 'react';
import React, { useMemo, useState } from 'react';
import type { Coordinates, NodeGrid, NodeRef } from './util/graphics';
import { beginPaint, Shape } from './util/graphics';

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

type CoordinateProps = {
    x: number,
    y: number,
    isOrigin: boolean,
    isGoal: boolean,
    setOrigin: Dispatch<SetStateAction<Coordinates>>,
    setGoal: Dispatch<SetStateAction<Coordinates>>,
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


const Algorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [velocity, setVelocity] = useState(() => DEFAULT_VELOCITY);
    const [radius, setRadius] = useState(() => DEFAULT_RADIUS);
    const [shape, setShape] = useState(() => Shape.CIRCLE);

    const [origin, setOrigin] = useState<Coordinates>({
        x: null,
        y: null
    });
    const [goal, setGoal] = useState<Coordinates>({
        x: null,
        y: null
    });


    const nodes = useMemo(() => {
        const refs: NodeGrid = [];
        for (let y = 0; y < rows; y++) {
            const row: NodeRef[] = [];
            refs.push(row);

            for (let x = 0; x < columns; x++) {
                row.push(createRef() as NodeRef);
            }
        }

        return refs;
    }, [columns, rows]);

    const initiate = () => {
        beginPaint({
            grid: nodes,
            origin,
            radius,
            shape,
            velocity
        });
    };

    const table = useMemo(() => {
        const elements = [];
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const ref = nodes[row]![column]!;

                elements.push(
                    <Coordinate
                        key={`${column},${row}`}
                        x={column}
                        y={row}
                        isOrigin={column === origin.x && row === origin.y}
                        setOrigin={setOrigin}
                        isGoal={column === goal.x && row === goal.y}
                        setGoal={setGoal}
                        gridRef={ref}
                    />
                );
            }
        }

        return elements;
    }, [nodes, rows, columns, origin.x, origin.y, goal.x, goal.y]);

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
