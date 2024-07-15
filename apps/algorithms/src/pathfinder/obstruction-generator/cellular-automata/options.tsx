import { type OGOptionsComponentProps } from '..';
import { FieldRangeInput } from 'ui-react19';

enum CellularAutomatonOptionsPreset {
    MAZE = 'Maze',
    MAZECTRIC = 'Mazectric',
    CWOL = 'Conway\'s way of life',
    HIGHLIFE = 'HighLife'
}

type InitialPattern = {
    type: 'random',
    probability: number
} | {
    type: 'use existing'
};

export type CellularAutomatonOptions = {
    setAlive: number,
    keepAlive: {
        min: number,
        max: number
    },
    steps: number,
    preset: CellularAutomatonOptionsPreset,
    initialPattern: InitialPattern,
};

const DEFAULT_OPTIONS = {
    steps: 100,
    initialPattern: {
        type: 'random',
        probability: 50
    }
} satisfies Partial<CellularAutomatonOptions>;

const CELLULAR_AUTOMATON_PRESETS_MAP: Record<CellularAutomatonOptionsPreset, CellularAutomatonOptions> = {
    [CellularAutomatonOptionsPreset.MAZECTRIC]: {
        ...DEFAULT_OPTIONS,
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 4
        },
        preset: CellularAutomatonOptionsPreset.MAZECTRIC
    },
    [CellularAutomatonOptionsPreset.MAZE]: {
        ...DEFAULT_OPTIONS,
        setAlive: 2,
        keepAlive: {
            min: 1,
            max: 5
        },
        preset: CellularAutomatonOptionsPreset.MAZE
    },
    [CellularAutomatonOptionsPreset.CWOL]: {
        ...DEFAULT_OPTIONS,
        setAlive: 3,
        keepAlive: {
            min: 2,
            max: 3
        },
        preset: CellularAutomatonOptionsPreset.CWOL
    },
    [CellularAutomatonOptionsPreset.HIGHLIFE]: {
        ...DEFAULT_OPTIONS,
        setAlive: 4,
        keepAlive: {
            min: 3,
            max: 6
        },
        preset: CellularAutomatonOptionsPreset.HIGHLIFE
    }
} as const;

export const CA_DEFAULT_OPTIONS = CELLULAR_AUTOMATON_PRESETS_MAP[CellularAutomatonOptionsPreset.CWOL];

const OGCellularAutomatonOptionsComponent = ({ options, setOptions }: OGOptionsComponentProps<CellularAutomatonOptions>) => {
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
                className='capitalize border rounded-md border-slate-3'
                value={options.preset}
                onChange={(e) => { // this does not allow reselecting an option
                    const newPreset = CELLULAR_AUTOMATON_PRESETS_MAP[e.currentTarget.value as CellularAutomatonOptionsPreset];
                    setOptions({
                        ...newPreset,
                        // don't override steps with default
                        steps: options.steps
                    });
                }}
            >
                {Object.values(CellularAutomatonOptionsPreset).map((value) => {
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
                className='capitalize border rounded-md border-slate-3'
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
            </div>
        </>
    );
};

export default OGCellularAutomatonOptionsComponent;
