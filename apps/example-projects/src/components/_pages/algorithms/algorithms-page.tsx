import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Ref, useRef } from 'react';
import { createRef } from 'react';
import { startTransition } from 'react';
import { memo } from 'react';
import React, { useMemo, useState } from 'react';
import type { Coordinate } from './util/common';
import type { NodeGrid, NodeRef } from './util/common';
import { beginBFS } from './util/algorithm';
import { beginPaint, Shape } from './util/graphics';
import Node from './node';

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

enum Mode {
    DRAW = 'draw',
    PATHFINDER = 'pathfinder',
    SORT = 'sort'
};

export type Nodes2 = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    isObstruction: MutableRefObject<boolean>,
};

const Algorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [velocity, setVelocity] = useState(() => DEFAULT_VELOCITY);
    const [radius, setRadius] = useState(() => DEFAULT_RADIUS);
    const [shape, setShape] = useState(() => Shape.CIRCLE);
    const [mode, setMode] = useState(() => Shape.CIRCLE);

    const velocityRef = useRef(velocity);

    const [origin, setOrigin] = useState<Coordinate>({
        x: 0,
        y: 0
    });
    const [goal, setGoal] = useState<Coordinate>({
        x: columns - 1,
        y: rows - 1
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

    const nodes2 = useMemo(() => {
        const refs: Nodes2[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: Nodes2[] = [];
            refs.push(row);

            for (let x = 0; x < columns; x++) {
                row.push({
                    setIsVisited: createRef() as MutableRefObject<Dispatch<SetStateAction<boolean>>>,
                    isObstruction: createRef() as MutableRefObject<boolean>
                });
            }
        }

        return refs;
    }, [columns, rows]);

    const initiate = () => {
        // beginPaint({
        //     grid: nodes,
        //     origin,
        //     radius,
        //     shape,
        //     velocity
        // });

        // beginBFS(origin, goal, nodes, velocityRef);
        beginBFS(origin, goal, nodes2, velocityRef);
    };

    // @ts-ignore
    global.nodes2 = nodes2;

    const table = useMemo(() => {
        const elements = [];
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const ref = nodes[row]![column]!;

                elements.push(
                    <Node
                        key={`${column},${row}`}
                        x={column}
                        y={row}
                        isOrigin={column === origin.x && row === origin.y}
                        setOrigin={setOrigin}
                        isGoal={column === goal.x && row === goal.y}
                        setGoal={setGoal}
                        gridRef={ref}
                        setVisitedRef={nodes2[row]![column]!.setIsVisited}
                        isObstructionRef={nodes2[row]![column]!.isObstruction}
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
                onChange={(e) => startTransition(() => {
                    const value = Number.parseInt(e.currentTarget.value);
                    velocityRef.current = value;
                    setVelocity(value);
                })}
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
