import type { Dispatch, SetStateAction } from 'react';
import { startTransition } from 'react';
import FieldRangeInput from 'ui/FieldRangeInput';

export type CellularAutomataOptions = {
    setAlive: number,
    keepAlive: {
        min: number,
        max: number
    },
    steps: number,
    interrupt?: boolean,
    preset?: string
};

export type CellularAutomataOptionsProps = {
    options: CellularAutomataOptions,
    setOptions: Dispatch<SetStateAction<CellularAutomataOptions>>
};

enum CAPreset {
    MAZE = 'maze',
    MAZECTRIC = 'mazectric',
    CWOL = 'conway\'s way of life'
};

const CA_PRESETS_MAP: Record<CAPreset, CellularAutomataOptions & { preset: string }> = {
    [CAPreset.MAZECTRIC]: {
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 4
        },
        steps: 100,
        preset: CAPreset.MAZECTRIC
    },
    [CAPreset.MAZE]: {
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 5
        },
        steps: 100,
        preset: CAPreset.MAZE
    }, // FIXME incorrect, fix - need to add extra options for this
    [CAPreset.CWOL]: {
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 3
        },
        steps: 100,
        preset: CAPreset.CWOL
    }
};

export const CA_DEFAULT_OPTIONS = CA_PRESETS_MAP[CAPreset.CWOL];

export const CAOptions = ({ options, setOptions }: CellularAutomataOptionsProps) => {
    if (!options) {
        return null;
    }

    return (
        <>
            <select
                id='ca-preset'
                className='border border-slate-3 rounded-md capitalize'
                value={options.preset}
                onChange={(e) => {
                    const newPreset = CA_PRESETS_MAP[e.currentTarget.value as CAPreset];
                    // setPreset(newPreset);
                    setOptions({
                        ...options,
                        ...newPreset
                    });
                }}
            >
                {Object.values(CAPreset).map((value) => {
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
            <div className='flex gap-2'>
                <FieldRangeInput
                    label='Steps'
                    defaultValue={options.steps}
                    min={1}
                    max={3000}
                    step={1}
                    onChange={(steps) => startTransition(() => setOptions(options => ({
                        ...options,
                        steps
                    })))}
                />
            </div>
        </>
    );
};
