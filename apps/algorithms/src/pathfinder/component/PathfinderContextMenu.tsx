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
import Checkbox from 'ui-react19/Checkbox';
import Select, { SelectItem } from 'ui-react19/Select';
import Label from 'ui-react19/Label';
import Button from 'ui-react19/Button';

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

    const clearObstructions = () => {
        setObstructionGeneratorState(State.IDLE);
        usePathfinderRendererStore.getState().renderer?.clearObstructions();
    };

    const runPathfinder = async (state: State, resume?: boolean) => {
        setPathfinderState(state);

        if (state === State.RUNNING) {
            // @ts-ignore
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
            <Label className='flex items-center justify-between'>
                Hide grid numbers
                <Checkbox
                    defaultChecked={renderer?.showNumbers}
                    onCheckedChange={() => renderer?.setShowNumbers((state) => !state)}
                />
            </Label>
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
            <Label className='flex flex-col gap-[0.5rem]'>
                <span className='text-muted-foreground'>
                    Pathfinder Algorithm
                </span>
                <Select
                    value={pathfinder}
                    onValueChange={(value) => setPathfinder(value as Pathfinder)}
                >
                    {Object.values(Pathfinder).map((value) => (
                        <SelectItem
                            className='capitalize'
                            value={value}
                            key={value}
                        >
                            {value}
                        </SelectItem>
                    ))}
                </Select>
            </Label>
            <Label className='flex flex-col gap-[0.5rem]'>
                <span className='text-muted-foreground'>
                    Obstruction Algorithm
                </span>
                <Select
                    value={obstructionGenerator}
                    onValueChange={(value) => setObstructionGenerator(value as ObstructionGenerator)}
                >
                    {Object.values(ObstructionGenerator).map((value) => (
                        <SelectItem
                            className='capitalize'
                            value={value}
                            key={value}
                        >
                            {value}
                        </SelectItem>
                    ))}
                </Select>
            </Label>
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
                        <div className='flex flex-col gap-4 m-4 text-sm font-medium'>
                            <p className='flex items-center gap-[1rem]'>
                                <FontAwesomeIcon
                                    color='#323538'
                                    icon={faInfoCircle}
                                    className='w-4 h-4'
                                />
                                Toggle obstructions using the left mouse button.
                            </p>
                            <p className='flex items-center gap-[1rem]'>
                                <FontAwesomeIcon
                                    color='#323538'
                                    icon={faInfoCircle}
                                    className='w-4 h-4'
                                />
                                Open the node context menu using the right mouse button.
                            </p>
                        </div>
                    </Expander>
                </div>
                <div className='mt-auto text-sm'>
                    <p className='px-2 font-medium capitalize'>
                    Pathfinder State:&nbsp;
                        <span className='font-semibold'>
                            [{pathfinderState}]
                        </span>
                    </p>
                    <p className='px-2 font-medium capitalize'>
                    Obstruction Generator State:&nbsp;
                        <span className='font-semibold'>
                            [{obstructionGeneratorState}]
                        </span>
                    </p>
                </div>
                <div className='flex gap-4 px-2'>
                    <Button
                        className='flex-1'
                        onClick={clearObstructions}
                        variant='destructive'
                    >
                            Clear Obstructions
                    </Button>
                    <Button
                        className='flex-1'
                        onClick={() => reset(pathfinder)}
                        variant='destructive'
                    >
                            Reset
                    </Button>
                </div>
            </div>
        </>
    );
}