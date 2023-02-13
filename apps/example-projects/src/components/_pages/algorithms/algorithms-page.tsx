import type {
    Dispatch,
    MutableRefObject,
    SetStateAction
} from 'react';
import {
    useTransition
} from 'react';
import {
    ChangeEvent,
    memo
} from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { createRef } from 'react';
import { startTransition } from 'react';
import React, { useMemo, useState } from 'react';
import type { Coordinate } from './util/common';
import { forEachNode } from './util/common';
import type { BeginBreadthFirstSearch } from './algorithm/bfs';
import { beginBFS } from './algorithm/bfs';
import { Shape } from './util/graphics';
import Node from './node';
import { BFSDirection, BFSOptions } from './algorithm/bfs';
import type { BeginDepthFirstSearch } from './algorithm/dfs';
import { DFSOptions } from './algorithm/dfs';
import { DFSDirection } from './algorithm/dfs';
import { beginDFS } from './algorithm/dfs';
// import debounce from 'lodash/debounce';
import _, { debounce, throttle } from 'lodash';
import { findDOMNode } from 'react-dom';

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
}

enum Algorithm {
    BREADTH_FIRST = 'breadth first',
    DEPTH_FIRST = 'depth first',
    DIJKSTRA = 'dijkstra',
    BIDIRECTIONAL = 'bidirectional'
}

const DefaultOption = {
    [Algorithm.BREADTH_FIRST]: BFSDirection.ORTHOGONAL,
    [Algorithm.DEPTH_FIRST]: DFSDirection.TBLR,
    [Algorithm.DIJKSTRA]: undefined,
    [Algorithm.BIDIRECTIONAL]: undefined
} as const;

type PlaceholderElementProps = any;
const PlaceholderElement = ({ ...props }: PlaceholderElementProps) => (
    <div>
        Placeholder!
    </div>
);

const ALGORITHM_OPTIONS_MAP = {
    [Algorithm.BREADTH_FIRST]: BFSOptions,
    [Algorithm.DEPTH_FIRST]: DFSOptions,
    [Algorithm.DIJKSTRA]: PlaceholderElement,
    [Algorithm.BIDIRECTIONAL]: PlaceholderElement
} as const;

const useOptions = (algorithm: Algorithm) => {
    const [options, setOptions] = useState(DefaultOption[algorithm]);

    useEffect(() => {
        setOptions(DefaultOption[algorithm]);
    }, [algorithm]);

    const Element = ALGORITHM_OPTIONS_MAP[algorithm];

    return [
        options,
        () => <Element option={options} setOption={setOptions} />
    ] as const;
};

export type Nodes2 = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    isObstruction: MutableRefObject<boolean>;
};

type PathfinderPlaceholder = (...args: any[]) => void;
type PathFinderMap = {
    [Algorithm.BREADTH_FIRST]: BeginBreadthFirstSearch,
    [Algorithm.DEPTH_FIRST]: BeginDepthFirstSearch,
    [Algorithm.DIJKSTRA]: PathfinderPlaceholder,
    [Algorithm.BIDIRECTIONAL]: PathfinderPlaceholder
};

const PATHFINDER_MAP: PathFinderMap = {
    [Algorithm.BREADTH_FIRST]: (...args) => beginBFS(...args),
    [Algorithm.DEPTH_FIRST]: (...args) => beginDFS(...args),
    [Algorithm.DIJKSTRA]: () => { },
    [Algorithm.BIDIRECTIONAL]: () => { }
} as const;


type GridProps = {
    data: {
        columns: number,
        rows: number,
        nodes: Nodes2[][],
        origin: Coordinate,
        goal: Coordinate,
        setOrigin: Dispatch<SetStateAction<Coordinate>>,
        setGoal: Dispatch<SetStateAction<Coordinate>>
    },
    shouldDebounce: MutableRefObject<boolean>
};

const DebouncedGrid = memo(function DebouncedGrid({ data, shouldDebounce }: GridProps) {
    const {
        columns,
        rows,
        nodes,
        origin,
        goal,
        setOrigin,
        setGoal
    } = data;

    const [reRenderCount, setReRenderCount] = useState(() => 0);
    const [isPending, startTransition] = useTransition();
    const previousGrid = useRef<JSX.Element>();
    const isFirstRenderRef = useRef(true);

    const debouncedRerender = useMemo(
        () => debounce(() => startTransition(() => setReRenderCount(state => state + 1)), 100),
        []
    );

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }

        if (shouldDebounce.current) {
            debouncedRerender();

            return () => {
                debouncedRerender.cancel();
            };
        }

        startTransition(() => setReRenderCount(state => state + 1));
    }, [columns, rows, nodes, origin.x, origin.y, goal.x, goal.y, debouncedRerender, shouldDebounce, isFirstRenderRef]);

    // console.log(`Rendering sub-component with value: ${renderCount}`);

    const memoizedGrid = useMemo(() => {
        const elements = [];
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                elements.push(
                    <Node
                        key={`${column},${row}`}
                        x={column}
                        y={row}
                        isOrigin={column === origin.x && row === origin.y}
                        setOrigin={setOrigin}
                        isGoal={column === goal.x && row === goal.y}
                        setGoal={setGoal}
                        setIsVisitedRef={nodes[row]![column]!.setIsVisited}
                        setIsHighlightedRef={nodes[row]![column]!.setIsHighlighted}
                        isObstructionRef={nodes[row]![column]!.isObstruction}
                    />
                );
            }
        }

        const gridContainer = (
            <div
                className='px-64 py-32'
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    height: '100%'
                }}
            >
                {elements}
            </div>
        );

        previousGrid.current = gridContainer;
        console.log('rerendering grid', reRenderCount);

        return gridContainer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRenderCount]);

    if (isPending) {
        console.log('showing previous');

        // return <h2>f u</h2>;
        return (
            <>
                <div className='grid place-items-center h-screen inset-0 absolute z-10 bg-red-500'>
                    <span className='text-3xl'>
                        LOADING
                    </span>
                </div>
                <span
                // className='px-64 py-32'
                // style={{
                //     display: 'grid',
                //     gridTemplateColumns: `repeat(${columns}, 1fr)`,
                //     gridTemplateRows: `repeat(${rows}, 1fr)`,
                //     height: '100%'
                // }}
                >
                    {/* {elements} */}
                    {previousGrid.current}
                </span>
            </>
        );
    };

    return memoizedGrid;
});

const Algorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [velocity, setVelocity] = useState(() => DEFAULT_VELOCITY);
    const [radius, setRadius] = useState(() => DEFAULT_RADIUS);
    const [shape, setShape] = useState(() => Shape.CIRCLE);
    const [algorithm, setAlgorithm] = useState(() => Algorithm.BREADTH_FIRST);
    const [mode, setMode] = useState(() => Mode.PATHFINDER);

    const [options, OptionsElement] = useOptions(algorithm);

    // console.log('main rendering');

    const velocityRef = useRef(velocity);
    const shouldDebounceGrid = useRef(false);

    const [origin, setOrigin] = useState<Coordinate>({
        x: 0,
        y: 0
    });
    const [goal, setGoal] = useState<Coordinate>({
        x: columns - 1,
        y: rows - 1
    });

    // TODO why not combine this and table ([{ element: <Node ... />, x, y, ... }])
    // if not possible, another solution surely exists
    const nodes = useMemo(() => {
        const refs: Nodes2[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: Nodes2[] = [];
            refs.push(row);

            for (let x = 0; x < columns; x++) {
                row.push({
                    setIsVisited: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    setIsHighlighted: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    isObstruction: createRef() as MutableRefObject<boolean>
                });
            }
        }

        return refs;
    }, [columns, rows]);

    const initiate = () => {
        // TODO use map!
        if (mode === Mode.DRAW) {
            //      beginPaint({
            //     grid: nodes,
            //     origin,
            //     radius,
            //     shape,
            //     velocity
            // });
            console.log(
                'i would now start drawing a shape, but it\'s late and the dev is tired, haha'
            );
        }

        if (mode === Mode.PATHFINDER && algorithm) {
            PATHFINDER_MAP[algorithm](
                origin,
                goal,
                nodes,
                velocityRef,
                // @ts-ignore
                options
            );
        }
    };

    const resetGrid = () => {
        forEachNode(nodes, (node) => node.setIsVisited.current(false));
    };

    // const table = useMemo(() => {
    //     const elements = [];
    //     for (let row = 0; row < rows; row++) {
    //         for (let column = 0; column < columns; column++) {
    //             elements.push(
    //                 <Node
    //                     key={`${column},${row}`}
    //                     x={column}
    //                     y={row}
    //                     isOrigin={column === origin.x && row === origin.y}
    //                     setOrigin={setOrigin}
    //                     isGoal={column === goal.x && row === goal.y}
    //                     setGoal={setGoal}
    //                     setIsVisitedRef={nodes[row]![column]!.setIsVisited}
    //                     setIsHighlightedRef={
    //                         nodes[row]![column]!.setIsHighlighted
    //                     }
    //                     isObstructionRef={nodes[row]![column]!.isObstruction}
    //                 />
    //             );
    //         }
    //     }

    //     return elements;
    // }, [nodes, rows, columns, origin.x, origin.y, goal.x, goal.y]);

    const gridOptions = useMemo(() => ({
        columns, rows, nodes, origin, goal, setOrigin, setGoal
    }), [columns, goal, nodes, origin, rows]);

    return (
        <div>
            <h1>Algorithms</h1>
            <OptionsElement />
            <div>
                <label htmlFor='columns'>Columns</label>
                <input
                    type='range'
                    // id='columns'
                    max={MAX_COLUMNS}
                    min={MIN_COLUMNS}
                    step={1}
                    value={columns}
                    // defaultValue={columns}
                    onChange={(e) => {
                        shouldDebounceGrid.current = true;
                        startTransition(() => setColumns(Number.parseInt(e.currentTarget.value)));
                    }}
                />
                <input
                    type='number'
                    id='columns'
                    max={MAX_COLUMNS}
                    min={MIN_COLUMNS}
                    step={1}
                    value={columns}
                    // defaultValue={columns}
                    onChange={(e) => {
                        shouldDebounceGrid.current = false;
                        startTransition(() => setColumns(Number.parseInt(e.currentTarget.value)));
                    }}
                />
            </div>
            <label htmlFor='rows'>Rows {rows}</label>
            <input
                type='range'
                id='rows'
                max={MAX_ROWS}
                min={MIN_ROWS}
                step={1}
                value={rows}
                onChange={(e) =>
                    startTransition(() =>
                        setRows(Number.parseInt(e.currentTarget.value))
                    )
                }
            />
            <label htmlFor='velocity'>Velocity {velocity}</label>
            <input
                type='range'
                id='velocity'
                max={MAX_VELOCITY}
                min={MIN_VELOCITY}
                step={1}
                value={velocity}
                onChange={(e) =>
                    startTransition(() => {
                        const value = Number.parseInt(e.currentTarget.value);
                        velocityRef.current = value;
                        setVelocity(value);
                    })
                }
            />
            <label htmlFor='radius'>Radius {radius}</label>
            <input
                type='range'
                id='radius'
                max={MAX_RADIUS}
                min={MIN_RADIUS}
                step={1}
                value={radius}
                onChange={(e) =>
                    startTransition(() =>
                        setRadius(Number.parseInt(e.currentTarget.value))
                    )
                }
            />
            <label htmlFor='mode'>Mode {mode}</label>
            <select
                id='mode'
                className='border border-black capitalize'
                value={mode}
                onChange={(e) =>
                    startTransition(() =>
                        setMode(e.currentTarget.value as Mode)
                    )
                }
            >
                {Object.values(Mode).map((value) => {
                    return (
                        <option
                            key={value}
                            value={value}
                            className='capitalize'
                        >
                            {value}
                        </option>
                    );
                })}
            </select>
            <label htmlFor='shape'>Shape {shape}</label>
            <select
                id='shape'
                className='border border-black capitalize'
                value={shape}
                onChange={(e) =>
                    startTransition(() =>
                        setShape(e.currentTarget.value as Shape)
                    )
                }
            >
                {Object.values(Shape).map((value) => {
                    return (
                        <option
                            key={value}
                            value={value}
                            className='capitalize'
                        >
                            {value}
                        </option>
                    );
                })}
            </select>
            <label htmlFor='algorithm' className='capitalize'>
                Algorithm {algorithm}
            </label>
            <select
                id='algorithm'
                className='border border-black capitalize'
                value={algorithm}
                onChange={(e) =>
                    startTransition(() =>
                        setAlgorithm(e.currentTarget.value as Algorithm)
                    )
                }
            >
                {Object.values(Algorithm).map((value) => {
                    return (
                        <option
                            key={value}
                            value={value}
                            className='capitalize'
                        >
                            {value}
                        </option>
                    );
                })}
            </select>
            <button onClick={initiate}>Initiate</button>
            <button onClick={resetGrid}>Reset Grid</button>
            {/* {table} */}
            <DebouncedGrid
                data={gridOptions}
                shouldDebounce={shouldDebounceGrid}
            />
            {/* <DebouncedSubComponent value={columns} /> */}
        </div>
    );
};

export default Algorithms;
