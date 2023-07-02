import type {
    Dispatch,
    MutableRefObject,
    SetStateAction
} from 'react';
import {
    useCallback,
    useTransition,
    useMemo,
    useState,
    forwardRef,
    useEffect,
    useRef,
    createRef
} from 'react';
import dynamic from 'next/dynamic';
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
import Expander from 'ui/expander';
import { NodeSelectionModeSelector } from './node-selection-mode';

const Grid = dynamic(() => import('./grid/grid'), {
    ssr: false
});

export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
};

export const enum Delay {
    MIN = 1,
    DEFAULT = 50,
    MAX = 1000
};

export type NodeReferences = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    obstruction: MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
    weight: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
    reset: MutableRefObject<() => void>
};

type PathfinderVisualizerProps = {
    modeSelector: JSX.Element,
    containedHeight?: number
};

export default forwardRef<HTMLDivElement, PathfinderVisualizerProps>(
    function PathfinderVisualizer({ modeSelector, containedHeight }, ref) {
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

        const [isMenuExpanded, setIsMenuExpanded] = useState(true);

        const setRowsTransition = useCallback((value: number) => startTransition(() => setRows(value)), []);
        const setColumnsTransition = useCallback((value: number) => startTransition(() => setColumns(value)), []);

        const setGlobalLoading = useLoading(state => state.setIsLoading);
        useEffect(() => setGlobalLoading(isPending), [isPending, setGlobalLoading]);
        useEffect(() => { stateRef.current = state; }, [state]);

        const nodes = useMemo(() => {
            const refs = new Array<NodeReferences[]>(rows);
            for (let y = 0; y < rows; y++) {
                const row = new Array<NodeReferences>(columns);

                for (let x = 0; x < columns; x++) {
                    row[x] = {
                        setIsVisited: createRef() as MutableRefObject<
                            Dispatch<SetStateAction<boolean>>
                        >,
                        setIsHighlighted: createRef() as MutableRefObject<
                            Dispatch<SetStateAction<boolean>>
                        >,
                        obstruction: createRef() as MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
                        weight: createRef() as MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
                        reset: createRef() as MutableRefObject<() => void>
                    };
                }

                refs[y] = row;
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

        // TODO remove when finished
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

        // TODO switch
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

        let settingsContents: JSX.Element;

        if (!isMenuExpanded) {
            settingsContents = (
                <div className='flex justify-between'>
                    <button
                        className='flex flex-col justify-center cursor-pointer'
                        onClick={() => setIsMenuExpanded(state => !state)}
                    >
                        {/* eslint-disable-next-line max-len */}
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                            {/* eslint-disable-next-line max-len */}
                            <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75' />
                        </svg>
                    </button>
                </div>
            );
        } else {
            settingsContents = (
                <div
                    className='flex flex-col gap-2 bg-white border-slate-300 border rounded-lg w-96 h-full p-2'
                >
                    <div className='flex justify-between gap-4 mb-4'>
                        {modeSelector}
                        <button
                            className='flex flex-col justify-center cursor-pointer'
                            onClick={() => setIsMenuExpanded(state => !state)}
                        >
                            {/* eslint-disable-next-line max-len */}
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                            </svg>

                        </button>
                    </div>
                    <FieldRangeInput
                        label='Rows'
                        defaultValue={rows}
                        min={Dimensions.MIN}
                        max={Dimensions.MAX}
                        step={1}
                        className='flex gap-2'
                        fieldStyle={{ marginLeft: 'auto' }}
                        onChange={setRowsTransition}
                    />
                    <FieldRangeInput
                        label='Columns'
                        defaultValue={columns}
                        min={Dimensions.MIN}
                        max={Dimensions.MAX}
                        step={1}
                        className='flex gap-2'
                        fieldStyle={{ marginLeft: 'auto' }}
                        onChange={setColumnsTransition}
                    />
                    <FieldRangeInput
                        label='Delay (ms)'
                        defaultValue={Delay.DEFAULT}
                        min={Delay.MIN}
                        max={Delay.MAX}
                        step={1}
                        className='flex gap-2'
                        fieldStyle={{ marginLeft: 'auto' }}
                        onChange={(velocity) => (velocityRef.current = velocity)}
                        debounceRange={false}
                    />
                    <NodeSelectionModeSelector />
                    <div className='flex flex-col justify-between h-full gap-4'>
                        <div className='flex flex-col gap-2'>
                            <Expander
                                label='Obstructions'
                                openInitial
                            >
                                <fieldset className='px-4 pt-3 pb-4'>
                                    <legend className='text-center px-4 hidden'>
                                        Grid Options
                                    </legend>
                                    <div className='flex flex-col gap-4'>
                                        <div className='grid gap-2'>
                                        </div>
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
                                        <ObstructionGeneratorOptions />
                                        <button
                                            className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
                                            onClick={() => void runOG()}>
                                            Generate maze
                                        </button>
                                    </div>
                                </fieldset>
                            </Expander>
                            <Expander label='Algorithm'>
                                <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4 grid gap-2'>
                                    <legend className='text-center px-4'>
                                        Algorithm Options
                                    </legend>
                                    <div className='flex flex-col gap-4'>
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
                                    </div>
                                    <PathfinderOptions />
                                </fieldset>
                            </Expander>
                        </div>
                        <div className='flex gap-2'>
                            <StateButton state={state} disable={!!result} onClick={() => void handleStart()} />
                            <button className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg' onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                        N</div>
                </div>
            );
        }

        return ( // strange stuff, but this needs translate(0) so the contained fixed element is not relative to viewport
            <div
                style={{
                    height: `calc(100vh - ${containedHeight ?? 0}px)`
                }}
                className='relative max-w-full p-2 translate-x-0 overflow-hidden'
                ref={ref}
            >
                <Grid data={gridData} />
                <div className='fixed right-2 inset-y-2'>
                    {settingsContents}
                </div>
            </div>
        );
    });
