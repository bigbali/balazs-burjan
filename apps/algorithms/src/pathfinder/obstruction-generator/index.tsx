import type { Dispatch, Reducer } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import { beginCAObstructionGenerator } from './cellular-automata';
import CAOptions, { CA_DEFAULT_OPTIONS } from './cellular-automata/options';
import { beginDFSObstructionGenerator } from './dfs';
import { beginRandomObstructionGenerator } from './random';
import RandomObstructionGeneratorOptions, { RANDOM_DEFAULT_OPTIONS } from './random/options';
import type { ValueOf } from '../../type';

export enum ObstructionGenerator {
    DFS = 'randomized depth first search',
    RANDOM = 'random',
    CELLULAR_AUTOMATA = 'cellular automata'
}

export type ObstructionGeneratorOptionsProps<T> = {
    options: T,
    setOptions: Dispatch<Partial<T>>
};

export const OBSTRUCTION_GENERATOR_MAP = {
    [ObstructionGenerator.DFS]: beginDFSObstructionGenerator,
    [ObstructionGenerator.RANDOM]: beginRandomObstructionGenerator,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: beginCAObstructionGenerator
} as const;

// TODO remove when ready
const DFSOpt: React.FC = () => {
    return null;
};

export const OBSTRUCTION_GENERATOR_OPTIONS_MAP = {
    [ObstructionGenerator.DFS]: DFSOpt,
    [ObstructionGenerator.RANDOM]: RandomObstructionGeneratorOptions,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: CAOptions
} as const;

export const OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP = {
    [ObstructionGenerator.DFS]: {},
    [ObstructionGenerator.RANDOM]: RANDOM_DEFAULT_OPTIONS,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: CA_DEFAULT_OPTIONS
} as const;

export type ObstructionGeneratorOptions = ValueOf<typeof OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP>;
type ObstructionGeneratorOptionsPayload<T> = Partial<T & { remount: boolean }>;

const reducer = <T extends ObstructionGeneratorOptions>(
    current: T, { remount, ...update }: ObstructionGeneratorOptionsPayload<T>
): T => {
    if (remount) {
        return { ...update } as unknown as T;
    }

    return {
        ...current,
        ...update
    };
};

let prevGenerator: ObstructionGenerator | null = null;

export const useObstructionGeneratorOptions = (generator: ObstructionGenerator) => {
    const [options, setOptions] = useReducer<
        Reducer<ObstructionGeneratorOptions, ObstructionGeneratorOptionsPayload<ObstructionGeneratorOptions>>
    >(
        reducer,
        OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator]
    );

    const Element = useCallback(() => {
        const Element = OBSTRUCTION_GENERATOR_OPTIONS_MAP[generator];
        // @ts-ignore
        return <Element options={options} setOptions={setOptions} key={generator} />;
        // we need to reassign Element only after `options` has changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    useEffect(() => {
        setOptions({
            ...OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator],
            remount: generator !== prevGenerator
        });
        prevGenerator = generator;
    }, [generator]);

    return [
        options,
        <Element />
    ] as const;
};
