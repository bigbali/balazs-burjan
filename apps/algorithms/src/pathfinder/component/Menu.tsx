import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { Entry, RunAction } from '../../type';
import { useState } from 'react';
import { PATHFINDER_MAP, Pathfinder, usePathfinderOptions } from '../algorithm';
import { FieldRangeInput, Expander } from 'ui-react19';
import { State, Delay, Dimensions } from '../../type';
import AlgorithmControls from './AlgorithmControls';
import { OBSTRUCTION_GENERATOR_MAP, ObstructionGenerator, useObstructionGeneratorOptions } from '../obstruction-generator';
import ObstructionGeneratorControls from './ObstructionGeneratorControls';
import useRenderer from '../hook/useRenderer';

type MenuProps = {
    ModeSelector: React.JSX.Element,
    rows: number,
    columns: number,
    state: State,
    result: Entry | null,
    delayRef: MutableRefObject<Delay>,
    stateRef: MutableRefObject<State>,
    setRows: (value: number) => void,
    setColumns: (value: number) => void,
    setPathfinderState: (state: State) => void,
    setResult: Dispatch<SetStateAction<Entry>>
};

const pending: { result: Promise<boolean | void> | null } = { result: null };

export default function Menu({
    ModeSelector,
    rows,
    columns,
    state,
    result,
    delayRef,
    stateRef,
    setRows,
    setColumns,
    setPathfinderState,
    setResult
}: MenuProps) {
    const [pathfinder, setPathfinder] = useState(Pathfinder.BREADTH_FIRST);
    const [pathfinderOptions, PathfinderOptions] = usePathfinderOptions(pathfinder);
    const [obstructionGenerator, setObstructionGenerator] = useState(ObstructionGenerator.CELLULAR_AUTOMATA);
    const [obstructionGeneratorOptions, ObstructionGeneratorOptions] = useObstructionGeneratorOptions(obstructionGenerator);

    const { renderer } = useRenderer();

    const runPathfinder = async (resume: boolean) => {
        const result = await PATHFINDER_MAP[pathfinder]({
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

        renderer?.reset();
    };

    const runObstructionGenerator = async () => {
        return await OBSTRUCTION_GENERATOR_MAP[obstructionGenerator]({
            delay: delayRef, //@ts-ignore
            options: obstructionGeneratorOptions
        });
    };

    const run: RunAction = async (actionType) => {
        setPathfinderState(actionType);

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
            setPathfinderState(State.IDLE);
            pending.result = null;
            return;
        }
    };

    // TODO wtf
    // useEffect(() => {
    //     if (pathfinderOptions === dijkstraDefaultOptions) {
    //         pathfinderOptions.grid = grid;
    //         pathfinderOptions.target = target;
    //     }
    // }, [pathfinderOptions, grid, target]);

    return (
        <div className='flex flex-col h-full gap-2 p-2 bg-white border rounded-lg w-[35rem] border-theme-border-light'>
            <div className='flex justify-between gap-4 mb-4'>
                {ModeSelector}
            </div>
            <label className='flex items-center justify-between'>
                Hide grid numbers
                <input
                    type='checkbox'
                    defaultChecked={renderer?.showNumbers}
                    onChange={() => renderer?.setShowNumbers((state) => !state)}
                    className='w-[1rem] h-[1rem]'
                />
            </label>
            <FieldRangeInput
                label='Rows'
                defaultValue={rows}
                min={Dimensions.MIN}
                max={Dimensions.MAX}
                step={1}
                className='flex gap-2'
                fieldStyle={{ marginLeft: 'auto' }}
                onChange={setRows}
            />
            <FieldRangeInput
                label='Columns'
                defaultValue={columns}
                min={Dimensions.MIN}
                max={Dimensions.MAX}
                step={1}
                className='flex gap-2'
                fieldStyle={{ marginLeft: 'auto' }}
                onChange={setColumns}
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
                    onChange={(e) =>
                        setPathfinder(e.currentTarget.value as Pathfinder)
                    }
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
                    onChange={(e) =>
                        setObstructionGenerator(
                            e.currentTarget.value as ObstructionGenerator
                        )
                    }
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
                    <Expander label='Algorithm'>
                        <fieldset className='px-4 pt-3 pb-4'>
                            {PathfinderOptions}
                        </fieldset>
                    </Expander>
                    <Expander label='Obstructions' openInitial>
                        <fieldset className='px-4 pt-3 pb-4'>
                            <div className='flex flex-col gap-4'>
                                {ObstructionGeneratorOptions}
                            </div>
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
                        <ObstructionGeneratorControls state={state} run={run} />
                    </div>
                    <div className='flex gap-2'>
                        <AlgorithmControls state={state} run={run} />
                        <button
                            className='px-4 py-2 font-medium text-white bg-red-700 rounded-lg'
                            onClick={reset}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}