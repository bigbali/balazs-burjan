import { useState, type ChangeEventHandler } from 'react';
import useSorterStore from '../hook/useSorterStore';
import { toNumber } from 'lodash';
import BubbleSort from '../algorithm/bubble';
import BogoSort from '../algorithm/bogo';
import SelectionSort from '../algorithm/selection';
import SorterControls from './SorterControls';
import type { Result } from '../../type';
import { Delay, State } from '../../type';
import { FieldRangeInput } from 'ui-react19';
import Input from 'ui-react19/Input';
import Label from 'ui-react19/Label';
import Select, { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'ui-react19/Select';

enum Sorter {
    BUBBLE = 'bubble sort',
    BOGO = 'bogo sort',
    SELECTION = 'selection sort'
}

const SORTER_MAP = {
    [Sorter.BUBBLE]: BubbleSort,
    [Sorter.BOGO]: BogoSort,
    [Sorter.SELECTION]: SelectionSort
} as const;

export default function SorterContextMenu() {
    const { renderer, values, state, setValues, setState, setStepInterval } = useSorterStore();
    const [sorter, setSorter] = useState<Sorter>(Sorter.BUBBLE);
    const [text, setText] = useState(() => values.join(', '));

    const onValuesChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const parsedValues = e.currentTarget.value.split(',').map(a => toNumber(a.trim())).filter(a => !isNaN(a));

        if (renderer) {
            renderer.draw(parsedValues);
        }

        setText(e.currentTarget.value);
        setValues(parsedValues);
    };

    let valuesCopy = structuredClone(values);
    const run = async (state: State, resume?: boolean) => {
        setState(state);

        if (state === State.RUNNING) {
            if (!resume) {
                valuesCopy = structuredClone(values);
            }

            const result = await SORTER_MAP[sorter].begin(valuesCopy);

            if ((result as Result).state === 'paused') {
                return;
            }

            setState(State.IDLE);
        }
    };

    return (
        <div className='flex flex-col gap-[1rem] h-full'>
            <Label className='flex flex-col gap-[0.5rem]'>
                <span className='text-muted-foreground'>
                    Input Values
                </span>
                <Input
                    type='text'
                    onChange={onValuesChange}
                    value={text}
                    disabled={state === State.RUNNING}
                    className='font-mono text-base'
                />
            </Label>
            <Label className='flex flex-col gap-[0.5rem]'>
                <span className='text-muted-foreground'>
                    Algorithm
                </span>
                <Select
                    value={sorter}
                    onValueChange={(value) => setSorter(value as Sorter)}
                >
                    <SelectTrigger className='w-full capitalize'>
                        <SelectValue   />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(Sorter).map((sorter) => (
                            <SelectItem
                                className='capitalize'
                                value={sorter}
                                key={sorter}
                            >
                                {sorter}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Label>
            <FieldRangeInput
                className='flex gap-[1rem]'
                fieldStyle={{ marginLeft: 'auto' }}
                label='Delay (ms)'
                min={Delay.MIN}
                max={Delay.MAX}
                defaultValue={Delay.DEFAULT}
                onChange={(value) => setStepInterval(value)}
            />
            <FieldRangeInput
                className='flex gap-[1rem]'
                fieldStyle={{ marginLeft: 'auto' }}
                label='Scaling'
                min={0.01}
                max={1}
                defaultValue={1}
                step={0.01}
                onChange={(value) => renderer?.setScaling(value)}
            />
            <div className='mt-auto'>
                <p className='px-2 font-medium capitalize'>
                    State:&nbsp;
                    [{state}]
                </p>
            </div>
            <SorterControls run={run} />
        </div>
    );
}