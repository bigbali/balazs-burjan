import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { PATHFINDER_MAP, Pathfinder, RESET_MAP, usePathfinderOptions } from '../algorithm';
import FieldRangeInput from 'ui/FieldRangeInput';
import type { Grid } from '../type';
import { Delay, Dimensions, PathfinderState } from '../type';
import StartButton from './start-button';
import Expander from 'ui/expander';
import { OBSTRUCTION_GENERATOR_MAP, ObstructionGenerator, useObstructionGeneratorOptions } from '../obstruction-generator';
import type { Coordinate, Entry } from '../../../util/type';
import { forEachNode } from '../../../util';
import { dijkstraDefaultOptions } from '../algorithm/dijkstra/options';

type SettingsMenuProps = {
    data: {
        ModeSelector: React.FC,
        rows: number,
        columns: number,
        grid: Grid,
        origin: Coordinate,
        target: Coordinate,
        state: PathfinderState,
        result: Entry | null,
        delayRef: MutableRefObject<Delay>,
        stateRef: MutableRefObject<PathfinderState>,
        setRowsTransition: (value: number) => void,
        setColumnsTransition: (value: number) => void,
        setPathfinderState: (state: PathfinderState) => void,
        setResult: Dispatch<SetStateAction<Entry>>
    }
};

export default function Menu({ data }: SettingsMenuProps) {
    const {
        ModeSelector,
        rows,
        columns,
        grid,
        origin,
        target,
        state,
        result,
        delayRef,
        stateRef,
        setRowsTransition,
        setColumnsTransition,
        setPathfinderState,
        setResult
    } = data;

    const [isExpanded, setIsExpanded] = useState(true);
    const [pathfinder, setPathfinder] = useState(Pathfinder.BREADTH_FIRST);
    const [pathfinderOptions, PathfinderOptions] = usePathfinderOptions(pathfinder);
    const [obstructionGenerator, setObstructionGenerator] = useState(ObstructionGenerator.CELLULAR_AUTOMATA);
    const [obstructionGeneratorOptions, ObstructionGeneratorOptions] = useObstructionGeneratorOptions(obstructionGenerator);

    const runPathfinder = async (resume: boolean) => {
        return await PATHFINDER_MAP[pathfinder]({
            origin,
            target,
            grid,
            delay: delayRef,
            state: stateRef,
            resume,
            // @ts-ignore NOTE move to algo like in case  dijkstra
            options: { direction: pathfinderOptions }
        });
    };

    const handleStart = async () => {
        const state = stateRef.current;

        if (state === PathfinderState.STOPPED) {
            setPathfinderState(PathfinderState.RUNNING);

            const shortestPath = await runPathfinder(false);

            if (stateRef.current !== PathfinderState.PAUSED) {
                setResult(shortestPath);
                setPathfinderState(PathfinderState.STOPPED);
            }
        }

        if (state === PathfinderState.RUNNING) {
            setPathfinderState(PathfinderState.PAUSED);
        }

        if (state === PathfinderState.PAUSED) {
            setPathfinderState(PathfinderState.RUNNING);

            const shortestPath = await runPathfinder(true);

            if (shortestPath) {
                setResult(shortestPath);
                setPathfinderState(PathfinderState.STOPPED);
            }
        }
    };

    const handleReset = () => {
        setPathfinderState(PathfinderState.STOPPED);
        setResult(null);

        RESET_MAP[pathfinder](() => {
            forEachNode(grid, (node) => node.reset());
        });
    };

    const runOG = async () => {
        return await OBSTRUCTION_GENERATOR_MAP[obstructionGenerator]({
            origin,
            target,
            grid,
            delay: delayRef, //@ts-ignore
            options: obstructionGeneratorOptions
        });
    };

    // TODO wtf
    useEffect(() => {
        if (pathfinderOptions === dijkstraDefaultOptions) {
            pathfinderOptions.grid = grid;
            pathfinderOptions.target = target;
        }
    }, [pathfinderOptions, grid, target]);

    if (!isExpanded) {
        return (
            <div className='fixed right-2 inset-y-2'>
                <div className='flex justify-between'>
                    <button
                        className='flex flex-col justify-center cursor-pointer'
                        onClick={() => setIsExpanded(state => !state)}
                    >
                        {/* eslint-disable-next-line max-len */}
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                            {/* eslint-disable-next-line max-len */}
                            <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75' />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className='fixed right-2 inset-y-2'>
            <div
                className='flex flex-col gap-2 bg-white border-slate-300 border rounded-lg w-96 h-full p-2'
            >
                <div className='flex justify-between gap-4 mb-4'>
                    <ModeSelector />
                    <button
                        className='flex flex-col justify-center cursor-pointer'
                        onClick={() => setIsExpanded(state => !state)}
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
                    onChange={(velocity) => (delayRef.current = velocity)}
                    debounceRange={false}
                />
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
                        <StartButton state={state} disable={!!result} onClick={() => void handleStart()} />
                        <button className='bg-red-700 text-white font-medium px-4 py-2 rounded-lg' onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}