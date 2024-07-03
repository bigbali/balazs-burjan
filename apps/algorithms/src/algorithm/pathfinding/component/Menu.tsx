import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, useEffect, useState } from 'react';
import { PATHFINDER_MAP, Pathfinder, RESET_MAP, usePathfinderOptions } from '../algorithm';
import { FieldRangeInput, Expander } from 'ui-react19';
import type { Grid, RunAction } from '../type';
import { State, Delay, Dimensions } from '../type';
import PathfinderAction from './PathfinderAction';
import { OBSTRUCTION_GENERATOR_MAP, ObstructionGenerator, useObstructionGeneratorOptions } from '../obstruction-generator';
import type { Coordinate, Entry } from '../../../util/type';
import { forEachNode } from '../../../util';
import { dijkstraDefaultOptions } from '../algorithm/dijkstra/options';
import ObstructionGeneratorAction from './ObstructionGeneratorAction';
import dynamic from 'next/dynamic';

type MenuProps = {
    ModeSelector: React.FC,
    rows: number,
    columns: number,
    grid: Grid,
    origin: Coordinate,
    target: Coordinate,
    state: State,
    setState: (state: State) => void
    result: Entry | null,
    delayRef: MutableRefObject<Delay>,
    stateRef: MutableRefObject<State>,
    setRowsTransition: (value: number) => void,
    setColumnsTransition: (value: number) => void,
    setPathfinderState: (state: State) => void,
    setResult: Dispatch<SetStateAction<Entry>>
};

const pending: { result: Promise<boolean | void> | null } = { result: null };

export default function Menu({
    ModeSelector,
    rows,
    columns,
    grid,
    origin,
    target,
    state,
    setState,
    result,
    delayRef,
    stateRef,
    setRowsTransition,
    setColumnsTransition,
    setPathfinderState,
    setResult
}: MenuProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [pathfinder, setPathfinder] = useState(Pathfinder.BREADTH_FIRST);
    const [pathfinderOptions, PathfinderOptions] = usePathfinderOptions(pathfinder);
    const [obstructionGenerator, setObstructionGenerator] = useState(ObstructionGenerator.CELLULAR_AUTOMATA);
    const [obstructionGeneratorOptions, ObstructionGeneratorOptions] = useObstructionGeneratorOptions(obstructionGenerator);

    const runPathfinder = async (resume: boolean) => {
        const result = await PATHFINDER_MAP[pathfinder]({
            origin,
            target,
            grid,
            delay: delayRef,
            state: stateRef,
            resume,
            // @ts-ignore NOTE move to algo like in case  dijkstra
            options: { direction: pathfinderOptions }
        });

        if (pending.result !== null) {
            setResult(result);
        }
    };

    const reset = () => {
        setPathfinderState(State.IDLE);
        setResult(null);

        RESET_MAP[pathfinder](() => {
            forEachNode(grid, (node) => node.reset());
        });
    };

    const runObstructionGenerator = async () => {
        return await OBSTRUCTION_GENERATOR_MAP[obstructionGenerator]({
            origin,
            target,
            grid,
            delay: delayRef, //@ts-ignore
            options: obstructionGeneratorOptions
        });
    };

    const run: RunAction = async (actionType) => {
        setState(actionType);

        switch (actionType) {
            case State.OBSTRUCTION_GENERATOR:
                pending.result = runObstructionGenerator();
                await pending.result;
                break;
            // case State.OBSTRUCTION_GENERATOR_CONTINUE:
            //     pending.value = runObstructionGenerator(true);
            //     await pending.value;
            //     break;
            case State.OBSTRUCTION_GENERATOR_PAUSED:
                pending.result = null;
                return;
            case State.PATHFINDER:
                pending.result = runPathfinder(false);
                await pending.result;
                break;
            case State.PATHFINDER_CONTINUE:
                pending.result = runPathfinder(true);
                await pending.result;
                break;
            case State.PATHFINDER_PAUSED:
                pending.result = null;
                return;
            default:
                return;
        }

        if (pending.result !== null) {
            setState(State.IDLE);
            pending.result = null;
            return;
        }
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
                className='flex flex-col h-full gap-2 p-2 bg-white border rounded-lg border-slate-300 w-96'
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
                <div className='flex gap-2'>
                    <label htmlFor='algorithm' className='capitalize'>
                        Pathfinder Algorithm
                    </label>
                    <select
                        id='algorithm'
                        className='ml-auto capitalize border rounded-md border-slate-3'
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
                <div className='flex gap-2'>
                    <label htmlFor='algorithm' className='capitalize'>
                        Obstruction Algorithm
                    </label>
                    <select
                        id='obstruction-generator'
                        className='ml-auto capitalize border rounded-md border-slate-3 h-fit'
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
                </div>
                <div className='flex flex-col justify-between h-full gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Expander
                            label='Obstructions'
                            openInitial
                        >
                            <fieldset className='px-4 pt-3 pb-4'>
                                <div className='flex flex-col gap-4'>
                                    {ObstructionGeneratorOptions}
                                </div>
                            </fieldset>
                        </Expander>
                        <Expander label='Algorithm'>
                            <fieldset className='grid gap-2 px-4 pt-3 pb-4 border rounded-lg border-slate-300'>
                                <legend className='px-4 text-center'>
                                    Algorithm Options
                                </legend>
                                {PathfinderOptions}
                            </fieldset>
                        </Expander>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-2'>
                            <button
                                className='px-4 py-2 font-medium text-white rounded-lg bg-slate-700'
                                onClick={() => {
                                    void run(State.OBSTRUCTION_GENERATOR);
                                }}
                            >
                                Generate Obstructions
                            </button>
                            <ObstructionGeneratorAction state={state} run={run} />
                        </div>
                        <div className='flex gap-2'>
                            <PathfinderAction state={state} run={run} />
                            <button className='px-4 py-2 font-medium text-white bg-red-700 rounded-lg' onClick={reset}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}