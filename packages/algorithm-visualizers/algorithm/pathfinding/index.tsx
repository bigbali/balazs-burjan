import type {
    Dispatch,
    MutableRefObject,
    SetStateAction
} from 'react';
import {
    useReducer
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
import { resetDijkstra } from './algorithm/dijkstra';
import { beginDijkstra } from './algorithm/dijkstra';
import { dijkstraDefaultOptions, DijkstraOptions } from './algorithm/dijkstra/options';
import { beginDFSObstructionGenerator } from './obstruction-generator/dfs';
import { beginRandomObstructionGenerator } from './obstruction-generator/random';

import {
    DEFAULT_OBSTRUCTION_GENERATOR,
    ObstructionGenerator,
    OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP,
    OBSTRUCTION_GENERATOR_MAP,
    OBSTRUCTION_GENERATOR_OPTIONS_MAP
} from './obstruction-generator';
import { Pathfinder } from './algorithm';

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

const DEFAULT_OPTION = {
    [Pathfinder.BREADTH_FIRST]: BFSDirection.ORTHOGONAL,
    [Pathfinder.DEPTH_FIRST]: DFSDirection.TBLR,
    [Pathfinder.DIJKSTRA]: dijkstraDefaultOptions,
    [Pathfinder.BIDIRECTIONAL]: undefined
} as const;

export type PlaceholderElementProps = any;
export const PlaceholderElement = ({ }: PlaceholderElementProps) => (
    <h1 className='text-5xl'>
        Placeholder!
    </h1>
);

const ALGORITHM_OPTIONS_MAP = {
    [Pathfinder.BREADTH_FIRST]: BFSOptions,
    [Pathfinder.DEPTH_FIRST]: DFSOptions,
    [Pathfinder.DIJKSTRA]: DijkstraOptions,
    [Pathfinder.BIDIRECTIONAL]: PlaceholderElement
} as const;

export type NodeReferences = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    obstruction: MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
    weight: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
    reset: MutableRefObject<() => void>
};

type PathfinderPlaceholder = (...args: any[]) => void;
type PathFinderMap = {
    [Pathfinder.BREADTH_FIRST]: BeginBFS,
    [Pathfinder.DEPTH_FIRST]: BeginDFS,
    [Pathfinder.DIJKSTRA]: BeginDijkstra,
    [Pathfinder.BIDIRECTIONAL]: PathfinderPlaceholder
};

const PATHFINDER_MAP: PathFinderMap = {
    [Pathfinder.BREADTH_FIRST]: beginBFS,
    [Pathfinder.DEPTH_FIRST]: beginDFS,
    [Pathfinder.DIJKSTRA]: beginDijkstra,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    [Pathfinder.BIDIRECTIONAL]: async () => { }
} as const;

const resetBidirectional = () => null;

export const RESET_MAP = {
    [Pathfinder.BREADTH_FIRST]: resetBFS,
    [Pathfinder.DEPTH_FIRST]: resetDFS,
    [Pathfinder.DIJKSTRA]: resetDijkstra,
    [Pathfinder.BIDIRECTIONAL]: resetBidirectional
} as const;

const usePathfinderOptions = (algorithm: Pathfinder) => {
    const [options, setOptions] = useState(DEFAULT_OPTION[algorithm]);

    useEffect(() => {
        setOptions(DEFAULT_OPTION[algorithm]);
    }, [algorithm]);

    const Element = ALGORITHM_OPTIONS_MAP[algorithm];

    return [
        options,
        () => <Element options={options} setOptions={setOptions} />
    ] as const;
};

const useObstructionGeneratorOptions = (generator: ObstructionGenerator) => {
    const [options, setOptions] = useState(OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator]);

    useEffect(() => {
        setOptions(OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator]);
    }, [generator]);

    const Element = OBSTRUCTION_GENERATOR_OPTIONS_MAP[generator];

    return [
        options, //@ts-ignore
        () => <Element options={options} setOptions={setOptions} />
    ] as const;
};

const PathfindingAlgorithms = () => {
    // const [gridOptions, setGridOptions] = useReducer({
    //     rows: Dimensions.DEFAULT,
    //     columns: Dimensions.DEFAULT,
    //     algorithm: PathfindingAlgorithm.BREADTH_FIRST,
    //     origin: { x: 0, y: 0 },
    //     goal: { x: Dimensions.DEFAULT - 1, y: Dimensions.DEFAULT - 1 }
    // }, (previous, current) => ({...previous, ...current}))

    const [rows, setRows] = useState(Dimensions.DEFAULT);
    const [columns, setColumns] = useState(Dimensions.DEFAULT);
    const [pathfinder, setPathfinder] = useState(Pathfinder.BREADTH_FIRST);
    const [pathfinderOptions, PathfinderOptions] = usePathfinderOptions(pathfinder);

    const [obstructionGenerator, setObstructionGenerator] = useState(DEFAULT_OBSTRUCTION_GENERATOR);
    const [obstructionGeneratorOptions, ObstructionGeneratorOptions] = useObstructionGeneratorOptions(obstructionGenerator);

    const [state, setState] = useState(PathfinderState.STOPPED);
    const [result, setResult] = useState<unknown>(null);

    const [origin, setOrigin] = useState<Coordinate>(({ x: 0, y: 0 }));
    const [goal, setGoal] = useState<Coordinate>(({ x: columns - 1, y: rows - 1 }));

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
                    obstruction: createRef() as MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
                    weight: createRef() as MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
                    reset: createRef() as MutableRefObject<() => void>
                });
            }
        }

        return refs;
    }, [columns, rows]);


    // FIXME replace with final solution
    useEffect(() => {
        type XXX = { x: number, y: number, parent: XXX };

        if (!result) return;

        let x = result as XXX;
        while (x.parent) {
            x = x.parent;
            nodes[x.y]![x.x]!.setIsHighlighted.current(true);
        }
    }, [nodes, result]);

    useEffect(() => {
        if (pathfinderOptions === dijkstraDefaultOptions) {
            pathfinderOptions.nodeReferences = nodes;
            pathfinderOptions.goal = goal;
        }
    }, [pathfinderOptions, nodes, goal]);
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
        return await PATHFINDER_MAP[pathfinder]({
            origin,
            goal,
            grid: nodes,
            delay: velocityRef,
            state: stateRef,
            resume,
            options: { direction: pathfinderOptions }
        });
    };

    const runOG = async () => {
        return await OBSTRUCTION_GENERATOR_MAP[obstructionGenerator]({
            origin,
            goal,
            grid: nodes,
            delay: velocityRef, //@ts-ignore
            options: obstructionGeneratorOptions
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
        setResult(null);

        RESET_MAP[pathfinder](() => {
            forEachNode(nodes, (node) => node.reset.current());
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
                    <select
                        id='obstruction-generator'
                        className='border border-slate-3 rounded-md capitalize'
                        value={obstructionGenerator}
                        onChange={(e) => setObstructionGenerator(e.currentTarget.value as ObstructionGenerator)}
                    >
                        {Object.values(ObstructionGenerator).map((value) => {
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
                    <button
                        className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
                        onClick={() => void runOG()}>
                        Generate maze
                    </button>
                    <ObstructionGeneratorOptions />

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
                                value={pathfinder}
                                onChange={(e) => setPathfinder(e.currentTarget.value as Pathfinder)}
                            >
                                {Object.values(Pathfinder).map((value) => {
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
                <PathfinderOptions />
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
