import type {
    Dispatch,
    MutableRefObject,
    SetStateAction
} from 'react';
import {
    useCallback
} from 'react';
import {
    useTransition
} from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { createRef } from 'react';
// import { startTransition } from 'react';
import React, { useMemo, useState } from 'react';
import type { Coordinate } from '../util/common';
import { forEachNode } from '../util/common';
import type { BeginBreadthFirstSearch } from './algorithm/bfs-generator';
import { beginBFS } from './algorithm/bfs-generator';
import { BFSDirection, BFSOptions } from './algorithm/bfs-generator';
// import type { BeginBreadthFirstSearch } from './algorithm/bfs';
// import { beginBFS } from './algorithm/bfs';
// import { BFSDirection, BFSOptions } from './algorithm/bfs';
import type { BeginDepthFirstSearch } from './algorithm/dfs';
import { DFSOptions } from './algorithm/dfs';
import { DFSDirection } from './algorithm/dfs';
import { beginDFS } from './algorithm/dfs';
import Grid from './grid/grid';

import FieldRangeInput from 'ui/FieldRangeInput';
import { useLoading } from '../../../../store/loading';
import { StateButton } from './state-button';
import { PathfindingAlgorithmsState } from './state';

export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
};

export const enum Velocity {
    MIN = 1,
    DEFAULT = 5,
    MAX = 100
};

enum PathfindingAlgorithm {
    BREADTH_FIRST = 'breadth first',
    DEPTH_FIRST = 'depth first',
    DIJKSTRA = 'dijkstra',
    BIDIRECTIONAL = 'bidirectional'
}

const DefaultOption = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BFSDirection.ORTHOGONAL,
    [PathfindingAlgorithm.DEPTH_FIRST]: DFSDirection.TBLR,
    [PathfindingAlgorithm.DIJKSTRA]: undefined,
    [PathfindingAlgorithm.BIDIRECTIONAL]: undefined
} as const;

type PlaceholderElementProps = any;
const PlaceholderElement = ({ }: PlaceholderElementProps) => (
    <h1 className='text-5xl'>
        Placeholder!
    </h1>
);

const ALGORITHM_OPTIONS_MAP = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BFSOptions,
    [PathfindingAlgorithm.DEPTH_FIRST]: DFSOptions,
    [PathfindingAlgorithm.DIJKSTRA]: PlaceholderElement,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PlaceholderElement
} as const;

export type Nodes2 = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    isObstruction: MutableRefObject<boolean>;
};

type PathfinderPlaceholder = (...args: any[]) => void;
type PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BeginBreadthFirstSearch,
    [PathfindingAlgorithm.DEPTH_FIRST]: BeginDepthFirstSearch,
    [PathfindingAlgorithm.DIJKSTRA]: PathfinderPlaceholder,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PathfinderPlaceholder
};

const PATHFINDER_MAP: PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: (...args) => beginBFS(...args),
    [PathfindingAlgorithm.DEPTH_FIRST]: (...args) => beginDFS(...args),
    [PathfindingAlgorithm.DIJKSTRA]: () => { },
    [PathfindingAlgorithm.BIDIRECTIONAL]: () => { }
} as const;

const usePathfindingOptions = (algorithm: PathfindingAlgorithm) => {
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

const PathfindingAlgorithms = () => {
    const [rows, setRows] = useState(Dimensions.DEFAULT);
    const [columns, setColumns] = useState(Dimensions.DEFAULT);
    const [algorithm, setAlgorithm] = useState(PathfindingAlgorithm.BREADTH_FIRST);
    const [state, setState] = useState(PathfindingAlgorithmsState.STOPPED);

    const [origin, setOrigin] = useState<Coordinate>(({ x: 0, y: 0 }));
    const [goal, setGoal] = useState<Coordinate>(({ x: columns - 1, y: rows - 1 }));

    const [options, OptionsElement] = usePathfindingOptions(algorithm);
    const [isPending, startTransition] = useTransition();

    const velocityRef = useRef(Velocity.DEFAULT);
    const stateRef = useRef(state);

    const setRowsTransition = useCallback((value: number) => startTransition(() => setRows(value)), []);
    const setColumnsTransition = useCallback((value: number) => startTransition(() => setColumns(value)), []);

    const setGlobalLoading = useLoading(state => state.setIsLoading);
    useEffect(() => setGlobalLoading(isPending), [isPending, setGlobalLoading]);
    useEffect(() => { stateRef.current = state; }, [state]);

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

    const gridData = useMemo(() => ({
        columns, rows, nodes, origin, goal, setOrigin, setGoal
    }), [columns, goal, nodes, origin, rows]);

    const resetGrid = () => {
        forEachNode(nodes, (node) => node.setIsVisited.current(false));
    };

    const handleClearGrid = () => { };
    const handleStart = () => {
        if (state === PathfindingAlgorithmsState.STOPPED) {
            stateRef.current = PathfindingAlgorithmsState.RUNNING;

            if (state === PathfindingAlgorithmsState.STOPPED) {
                PATHFINDER_MAP[algorithm](
                    origin,
                    goal,
                    nodes,
                    velocityRef,
                    stateRef,
                    { direction: options }
                );
            }

            setState(PathfindingAlgorithmsState.RUNNING);
        }
        if (state === PathfindingAlgorithmsState.RUNNING) {
            stateRef.current = PathfindingAlgorithmsState.PAUSED;
            setState(PathfindingAlgorithmsState.PAUSED);
        }
        if (state === PathfindingAlgorithmsState.PAUSED) {
            stateRef.current = PathfindingAlgorithmsState.RUNNING;
            PATHFINDER_MAP[algorithm](
                origin,
                goal,
                nodes,
                velocityRef,
                stateRef,
                { direction: options }
            );
            setState(PathfindingAlgorithmsState.RUNNING);
        }
    };

    console.log('state', state);
    const handleReset = () => {
        setState(PathfindingAlgorithmsState.STOPPED);
    };

    return (
        <div className='flex gap-4 flex-col'>
            <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4'>
                <legend className='text-center px-4'>
                    Grid Options
                </legend>
                <div className='flex gap-4'>
                    <FieldRangeInput
                        label='Rows'
                        defaultValue={rows}
                        min={Dimensions.MIN}
                        max={Dimensions.MAX}
                        step={1}
                        onChange={setRowsTransition}
                    />
                    <FieldRangeInput
                        label='Columns'
                        defaultValue={columns}
                        min={Dimensions.MIN}
                        max={Dimensions.MAX}
                        step={1}
                        onChange={setColumnsTransition}
                    />
                </div>
            </fieldset>
            <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4 mb-3'>
                <legend className='text-center px-4'>
                    Algorithm Options
                </legend>
                <div className='flex gap-4'>
                    <div>
                        <div className='flex gap-2'>
                            <label htmlFor='algorithm' className='capitalize'>
                                Algorithm
                            </label>
                            <select
                                id='algorithm'
                                className='border border-slate-3 rounded-md capitalize'
                                value={algorithm}
                                onChange={(e) => setAlgorithm(e.currentTarget.value as PathfindingAlgorithm)}
                            >
                                {Object.values(PathfindingAlgorithm).map((value) => {
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
                        </div>
                    </div>
                    <FieldRangeInput
                        label='Velocity'
                        defaultValue={Velocity.DEFAULT}
                        min={Velocity.MIN}
                        max={Velocity.MAX}
                        step={1}
                        onChange={(velocity) => (velocityRef.current = velocity)}
                        debounceRange={false}
                    />
                </div>
                <OptionsElement />
                <div className='flex gap-2'>
                    <StateButton state={state} onClick={handleStart} />
                    <button className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg' onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </fieldset>
            <Grid data={gridData} />
        </div>
    );
};

export default PathfindingAlgorithms;
