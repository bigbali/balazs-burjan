import { Pathfinder } from '../../type';
import { useState } from 'react';
import { PATHFINDER_MAP, usePathfinderOptions } from '../algorithm';
import { FieldRangeInput, Expander } from 'ui-react19';
import { State, Delay, Dimensions } from '../../type';
import AlgorithmControls from './AlgorithmControls';
import { OG_MAP, ObstructionGenerator, useObstructionGeneratorOptions } from '../obstruction-generator';
import ObstructionGeneratorControls from './ObstructionGeneratorControls';
import { usePathfinderRendererStore } from '../hook/usePathfinderRenderer';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePathfinderStore from '../hook/usePathfinderStore';

export default function PathfinderContextMenu() {
    const {
        columns,
        rows,
        pathfinder,
        pathfinderState,
        obstructionGeneratorState,
        stepInterval,
        setColumns,
        setRows,
        setResult,
        setPathfinderState,
        setObstructionGeneratorState,
        setPathfinder
    } = usePathfinderStore();
    const [pathfinderOptions, PathfinderOptions] = usePathfinderOptions(pathfinder);
    const [obstructionGenerator, setObstructionGenerator] = useState(ObstructionGenerator.CELLULAR_AUTOMATON);
    const [obstructionGeneratorOptions, ObstructionGeneratorOptions] = useObstructionGeneratorOptions(obstructionGenerator);

    const renderer = usePathfinderRendererStore(state => state.renderer);

    const reset = (pathfinder: Pathfinder) => {
        setPathfinderState(State.IDLE);
        setObstructionGeneratorState(State.IDLE);
        setResult(null);

        PATHFINDER_MAP[pathfinder].reset();

        usePathfinderRendererStore.getState().renderer?.reset();

        // ??? renderer is null
        // renderer?.reset();
    };

    const runPathfinder = async (state: State, resume?: boolean) => {
        setPathfinderState(state);

        if (state === State.RUNNING) {
            const result = await PATHFINDER_MAP[pathfinder].begin({
                // @ts-ignore
                options: pathfinderOptions
            }, resume);

            if (result && typeof result !== 'boolean' && 'paused' in result) {
                return;
            }

            setResult(result);
            setPathfinderState(State.IDLE);
        }
    };

    const runObstructionGenerator = async (state: State, resume?: boolean) => {
        setObstructionGeneratorState(state);

        if (state === State.RUNNING) {
            const result = await OG_MAP[obstructionGenerator].begin({
                // @ts-ignore
                options: obstructionGeneratorOptions
            }, resume);

            if (result && typeof result !== 'boolean' && 'paused' in result) {
                return;
            }

            setObstructionGeneratorState(State.IDLE);
        }
    };

    return (
        <>
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
                value={rows}
                min={Dimensions.MIN}
                max={Dimensions.MAX}
                step={1}
                className='flex gap-2'
                fieldStyle={{ marginLeft: 'auto' }}
                onChange={setRows}
            />
            <FieldRangeInput
                label='Columns'
                value={columns}
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
                onChange={(interval) => (stepInterval.current = interval)}
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
                    <Expander label='Algorithm' openInitial>
                        <fieldset className='flex flex-col gap-[1rem] px-4 pt-3 pb-4'>
                            <div className='flex flex-col gap-4'>
                                {PathfinderOptions}
                            </div>
                            <AlgorithmControls run={runPathfinder} />
                        </fieldset>
                    </Expander>
                    <Expander label='Obstructions' openInitial>
                        <fieldset className='flex flex-col gap-[1rem] px-4 pt-3 pb-4'>
                            <div className='flex flex-col gap-4'>
                                {ObstructionGeneratorOptions}
                            </div>
                            <ObstructionGeneratorControls run={runObstructionGenerator} />
                        </fieldset>
                    </Expander>
                    <Expander label='Help'>
                        <div className='flex flex-col gap-4 m-4 font-medium'>
                            <p className='flex items-center gap-[1rem]'>
                                <FontAwesomeIcon
                                    color='#323538'
                                    icon={faInfoCircle}
                                    className='w-[1.2rem] h-[1.2rem]'
                                />
                                Toggle obstructions using the left mouse button.
                            </p>
                            <p className='flex items-center gap-[1rem]'>
                                <FontAwesomeIcon
                                    color='#323538'
                                    icon={faInfoCircle}
                                    className='w-[1.2rem] h-[1.2rem]'
                                />
                                Open the node context menu using the right mouse button.
                            </p>
                        </div>
                    </Expander>
                </div>
                <div className='mt-auto'>
                    <p className='px-2 font-medium capitalize'>
                    Pathfinder State:&nbsp;
                    [{pathfinderState}]
                    </p>
                    <p className='px-2 font-medium capitalize'>
                    Obstruction Generator State:&nbsp;
                    [{obstructionGeneratorState}]
                    </p>
                </div>
                <div className='gap-4 px-2'>
                    <button
                        className='w-full px-4 py-2 font-medium text-white bg-red-700 rounded-lg'
                        onClick={() => reset(pathfinder)}
                    >
                            Clear Grid
                    </button>
                </div>
            </div>
        </>
    );
}