import type { MutableRefObject } from 'react';
import { createRef, memo } from 'react';
import FieldRangeInput from 'ui/FieldRangeInput';
import type { ObstructionGeneratorOptionsProps } from '..';

enum CAPreset {
    MAZE = 'Maze',
    MAZECTRIC = 'Mazectric',
    CWOL = 'Conway\'s way of life',
    HIGHLIFE = 'HighLife'
};

type InitialPattern = { type: 'random', probability: number } | { type: 'manual' };

export type CellularAutomataOptions = {
    setAlive: number,
    keepAlive: {
        min: number,
        max: number
    },
    steps: number,
    preset?: CAPreset,
    initialPattern: InitialPattern,
    interrupt?: MutableRefObject<boolean>
};

const DEFAULT_OPTIONS = {
    steps: 100,
    initialPattern: {
        type: 'random',
        probability: 50
    },
    interrupt: createRef<boolean>() as MutableRefObject<boolean>
} satisfies Partial<CellularAutomataOptions>;

const CA_PRESETS_MAP: Record<CAPreset, CellularAutomataOptions> = {
    [CAPreset.MAZECTRIC]: {
        ...DEFAULT_OPTIONS,
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 4
        },
        preset: CAPreset.MAZECTRIC
    },
    [CAPreset.MAZE]: {
        ...DEFAULT_OPTIONS,
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 5
        },
        preset: CAPreset.MAZE
    },
    [CAPreset.CWOL]: {
        ...DEFAULT_OPTIONS,
        setAlive: 3,
        keepAlive: {
            min: 2,
            max: 3
        },
        preset: CAPreset.CWOL
    },
    [CAPreset.HIGHLIFE]: {
        ...DEFAULT_OPTIONS,
        setAlive: 4,
        keepAlive: {
            min: 3,
            max: 6
        },
        preset: CAPreset.HIGHLIFE
    }
} as const;

export const CA_DEFAULT_OPTIONS = CA_PRESETS_MAP[CAPreset.CWOL];

const CAOptions: React.FC<ObstructionGeneratorOptionsProps<CellularAutomataOptions>> = ({ options, setOptions }) => {
    if (!options) {
        return null;
    }

    return (
        <>
            <label htmlFor='ca-preset'>
                Preset
            </label>
            <select
                id='ca-preset'
                className='border border-slate-3 rounded-md capitalize'
                value={options.preset}
                onChange={(e) => { // this does not allow reselecting an option
                    const newPreset = CA_PRESETS_MAP[e.currentTarget.value as CAPreset];
                    setOptions({
                        ...newPreset,
                        // don't override steps with default
                        steps: options.steps
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
            <label htmlFor='ca-initial-pattern'>
                Starting Pattern
            </label>
            <select
                id='ca-initial-pattern'
                className='border border-slate-3 rounded-md capitalize'
                value={options.initialPattern.type}
                onChange={(e) => {
                    const initialPatternType = e.currentTarget.value as typeof options.initialPattern.type;
                    const initialPattern = initialPatternType === 'random'
                        ? { type: initialPatternType, probability: 50 }
                        : { type: initialPatternType };

                    setOptions({
                        initialPattern: { ...initialPattern },
                        steps: options.steps
                    });
                }}
            >
                <option
                    value='random'
                    className='capitalize'
                >
                    Generate Random
                </option>
                <option
                    value='manual'
                    className='capitalize'
                >
                    Use Existing
                </option>
            </select>
            <div className='flex flex-col flex-wrap gap-2'>
                {options.initialPattern.type === 'random' && (
                    <FieldRangeInput
                        label='Probability'
                        defaultValue={options.initialPattern.probability}
                        min={1}
                        max={100}
                        step={1}
                        className='flex gap-2'
                        fieldStyle={{ marginLeft: 'auto' }}
                        onChange={(probability) => setOptions({
                            initialPattern: {
                                type: 'random',
                                probability
                            }
                        })}
                    />
                )}
                <FieldRangeInput
                    label='Steps'
                    defaultValue={options.steps}
                    min={1}
                    max={3000}
                    step={1}
                    className='flex gap-2'
                    fieldStyle={{ marginLeft: 'auto' }}
                    onChange={(steps) => setOptions({ steps })}
                    title='Number of iterations to run before stopping'
                />
                <FieldRangeInput
                    label='Set Alive'
                    defaultValue={options.setAlive}
                    min={0}
                    max={8}
                    step={1}
                    className='flex gap-2'
                    fieldStyle={{ marginLeft: 'auto' }}
                    onChange={(setAlive) => setOptions({ setAlive })}
                    title='Set cell state to alive if there are exactly this many alive adjacent cells'
                />
                <FieldRangeInput
                    label='Keep Alive Min'
                    defaultValue={options.keepAlive.min}
                    min={0}
                    max={8}
                    step={1}
                    className='flex gap-2'
                    fieldStyle={{ marginLeft: 'auto' }}
                    onChange={(min) => setOptions({
                        keepAlive: {
                            ...options.keepAlive,
                            min
                        }
                    })}
                    title='Keep cell state as alive if there are at least this many alive adjacent cells'
                />
                <FieldRangeInput
                    label='Keep Alive Max'
                    defaultValue={options.keepAlive.max}
                    min={0}
                    max={8}
                    step={1}
                    className='flex gap-2'
                    fieldStyle={{ marginLeft: 'auto' }}
                    onChange={(max) => setOptions({
                        keepAlive: {
                            ...options.keepAlive,
                            max
                        }
                    })}
                    title='Keep cell state as alive if there are at most this many alive adjacent cells'
                />
                <button
                    className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
                    onClick={() => {
                        if (!options.interrupt) {
                            options.interrupt = createRef() as MutableRefObject<boolean>;
                        }
                        options.interrupt.current = true;
                    }}
                    title='Stop the Obstruction Generator'
                >
                    Interrupt
                </button>
            </div>
        </>
    );
};

export default memo(CAOptions);
