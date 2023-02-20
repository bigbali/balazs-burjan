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
import React, { useMemo, useState } from 'react';
import type { BeginDFS } from './algorithm/dfs';
import { resetDFS } from './algorithm/dfs';
import { beginDFS } from './algorithm/dfs';
import Grid from './grid/grid';

import FieldRangeInput from 'ui/FieldRangeInput';
import { StateButton } from './state-button';
import { PathfinderState } from './state';
import { BFSDirection } from './algorithm/bfs/direction';
import { BFSOptions } from './algorithm/bfs/options';
import type { BeginBFS } from './algorithm/bfs';
import { beginBFS } from './algorithm/bfs';
import { resetBFS } from './algorithm/bfs/';
import type { Coordinate } from '../../util/common';
import { forEachNode } from '../../util/common';
import { useLoading } from '../../store/loading';
import { DFSDirection } from './algorithm/dfs/direction';
import { DFSOptions } from './algorithm/dfs/options';
import type { BeginDijkstra } from './algorithm/dijkstra';
import { beginDijkstra } from './algorithm/dijkstra';

export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
};

export const enum Delay {
    MIN = 1,
    DEFAULT = 10,
    MAX = 200
};

export enum PathfindingAlgorithm {
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

export type NodeReferences = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    isObstruction: MutableRefObject<boolean>,
    weight: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>
};

type PathfinderPlaceholder = (...args: any[]) => void;
type PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BeginBFS,
    [PathfindingAlgorithm.DEPTH_FIRST]: BeginDFS,
    [PathfindingAlgorithm.DIJKSTRA]: BeginDijkstra,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PathfinderPlaceholder
};

const PATHFINDER_MAP: PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: async (...args) => beginBFS(...args),
    [PathfindingAlgorithm.DEPTH_FIRST]: async (...args) => beginDFS(...args),
    [PathfindingAlgorithm.DIJKSTRA]: async (...args) => beginDijkstra(...args),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    [PathfindingAlgorithm.BIDIRECTIONAL]: async () => { }
} as const;

const resetBidirectional = () => null;
const resetDijkstra = () => null;

export const RESET_MAP = {
    [PathfindingAlgorithm.BREADTH_FIRST]: resetBFS,
    [PathfindingAlgorithm.DEPTH_FIRST]: resetDFS,
    [PathfindingAlgorithm.BIDIRECTIONAL]: resetBidirectional,
    [PathfindingAlgorithm.DIJKSTRA]: resetDijkstra
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
    const [state, setState] = useState(PathfinderState.STOPPED);
    const [result, setResult] = useState<unknown>(null);

    const [origin, setOrigin] = useState<Coordinate>(({ x: 0, y: 0 }));
    const [goal, setGoal] = useState<Coordinate>(({ x: columns - 1, y: rows - 1 }));

    const [options, OptionsElement] = usePathfindingOptions(algorithm);
    const [isPending, startTransition] = useTransition();

    const velocityRef = useRef(Delay.DEFAULT);
    const stateRef = useRef(state);

    const setRowsTransition = useCallback((value: number) => startTransition(() => setRows(value)), []);
    const setColumnsTransition = useCallback((value: number) => startTransition(() => setColumns(value)), []);

    const setGlobalLoading = useLoading(state => state.setIsLoading);
    useEffect(() => setGlobalLoading(isPending), [isPending, setGlobalLoading]);
    useEffect(() => { stateRef.current = state; }, [state]);

    const nodes = useMemo(() => {
        const refs: NodeReferences[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: NodeReferences[] = [];
            refs.push(row);

            for (let x = 0; x < columns; x++) {
                row.push({
                    setIsVisited: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    setIsHighlighted: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    isObstruction: createRef() as MutableRefObject<boolean>,
                    weight: createRef() as MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>
                });
            }
        }

        return refs;
    }, [columns, rows]);

    //@ts-ignore
    global.NODES = nodes;

    const gridData = useMemo(() => ({
        columns, rows, nodes, origin, goal, setOrigin, setGoal
    }), [columns, goal, nodes, origin, rows]);

    const updateState = (state: PathfinderState) => {
        stateRef.current = state;
        setState(state);
    };

    const runPathfinder = async (resume: boolean) => {
        return await PATHFINDER_MAP[algorithm]({
            origin,
            goal,
            grid: nodes,
            delay: velocityRef,
            state: stateRef,
            resume,
            options: { direction: options }
        });
    };

    const handleStart = async () => {
        if (state === PathfinderState.STOPPED) {
            updateState(PathfinderState.RUNNING);

            const shortestPath = await runPathfinder(false);

            if (stateRef.current !== PathfinderState.PAUSED) {
                setResult(shortestPath);
                updateState(PathfinderState.STOPPED);
            }
        }

        if (state === PathfinderState.RUNNING) {
            updateState(PathfinderState.PAUSED);
        }

        if (state === PathfinderState.PAUSED) {
            updateState(PathfinderState.RUNNING);

            const shortestPath = await runPathfinder(true);

            if (shortestPath) {
                setResult(shortestPath);
                updateState(PathfinderState.STOPPED);
            }
        }
    };

    const handleReset = () => {
        stateRef.current = PathfinderState.STOPPED;
        setState(PathfinderState.STOPPED);

        resetBFS(() => setResult(null));

        RESET_MAP[algorithm](() => {
            forEachNode(nodes, (node) => node.setIsVisited.current(false));
        });
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
            <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4 mb-3 grid gap-2'>
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
                        label='Delay (ms)'
                        defaultValue={Delay.DEFAULT}
                        min={Delay.MIN}
                        max={Delay.MAX}
                        step={1}
                        onChange={(velocity) => (velocityRef.current = velocity)}
                        debounceRange={false}
                    />
                </div>
                <OptionsElement />
                <div className='flex gap-2'>
                    <StateButton state={state} disable={!!result} onClick={() => void handleStart()} />
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
