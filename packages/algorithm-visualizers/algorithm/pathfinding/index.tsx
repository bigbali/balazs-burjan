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
import Grid from './grid/grid';
import FieldRangeInput from 'ui/FieldRangeInput';
import { StateButton } from './state-button';
import { PathfinderState } from './state';
import type { Coordinate } from '../../util/common';
import { forEachNode } from '../../util/common';
import { useLoading } from '../../store/loading';
import { dijkstraDefaultOptions } from './algorithm/dijkstra/options';

import {
    DEFAULT_OBSTRUCTION_GENERATOR,
    ObstructionGenerator,
    OBSTRUCTION_GENERATOR_MAP,
    useObstructionGeneratorOptions
} from './obstruction-generator';
import { Pathfinder, PATHFINDER_MAP, RESET_MAP, usePathfinderOptions } from './algorithm';

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

export type NodeReferences = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    obstruction: MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
    weight: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
    reset: MutableRefObject<() => void>
};

const PathfinderVisualizer = () => {
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

export default PathfinderVisualizer;
