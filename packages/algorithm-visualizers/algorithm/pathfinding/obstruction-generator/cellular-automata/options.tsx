import type { Dispatch, MutableRefObject } from 'react';
import { createRef, memo } from 'react';
import FieldRangeInput from 'ui/FieldRangeInput';

enum CAPreset {
    MAZE = 'maze',
    MAZECTRIC = 'mazectric',
    CWOL = 'conway\'s way of life'
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

export type CellularAutomataOptionsProps = {
    options: CellularAutomataOptions,
    setOptions: Dispatch<Partial<CellularAutomataOptions>>
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
    }
};

export const CA_DEFAULT_OPTIONS = CA_PRESETS_MAP[CAPreset.CWOL];

const CAOptions = ({ options, setOptions }: CellularAutomataOptionsProps) => {
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
                onChange={(e) => {
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
                        initialPattern: { ...initialPattern }
                    });
                }}
            >
                <option
                    value='random'
                    className='capitalize'
                >
                    Random
                </option>
                <option
                    value='manual'
                    className='capitalize'
                >
                    Manual
                </option>
            </select>
            <div className='flex gap-2 flex-wrap'>
                {options.initialPattern.type === 'random' && (
                    <FieldRangeInput
                        label='Probability'
                        defaultValue={options.initialPattern.probability}
                        min={1}
                        max={100}
                        step={1}
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
                    onChange={(steps) => setOptions({ steps })}
                />
                <FieldRangeInput
                    label='Set Alive'
                    defaultValue={options.setAlive}
                    min={0}
                    max={8}
                    step={1}
                    onChange={(setAlive) => setOptions({ setAlive })}
                />
                <FieldRangeInput
                    label='Keep Alive Min'
                    defaultValue={options.keepAlive.min}
                    min={0}
                    max={8}
                    step={1}
                    onChange={(min) => setOptions({
                        keepAlive: {
                            ...options.keepAlive,
                            min
                        }
                    })}
                />
                <FieldRangeInput
                    label='Keep Alive Max'
                    defaultValue={options.keepAlive.max}
                    min={0}
                    max={8}
                    step={1}
                    onChange={(max) => setOptions({
                        keepAlive: {
                            ...options.keepAlive,
                            max
                        }
                    })}
                />
                <button
                    className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
                    onClick={() => {
                        if (!options.interrupt) {
                            options.interrupt = createRef() as MutableRefObject<boolean>;
                        }
                        options.interrupt.current = true;
                    }}>
                    Interrupt
                </button>
            </div>
        </>
    );
};

export default memo(CAOptions);
