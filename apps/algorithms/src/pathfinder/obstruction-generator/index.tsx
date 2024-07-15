import type { Dispatch, Reducer, ReducerAction } from 'react';
import type { ValueOf } from '../../type';
import { useCallback, useEffect, useReducer } from 'react';
import OGCellularAutomaton from './cellular-automata';
import OGCellularAutomatonOptionsComponent, { CA_DEFAULT_OPTIONS } from './cellular-automata/options';
import OGRandomOptionsComponent, { RANDOM_DEFAULT_OPTIONS } from './random/options';
import OGRandomizedDepthFirstSearch from './dfs';
import OGRandom from './random';
import OGDFSOptionsComponent from './dfs/options';

export enum ObstructionGenerator {
    DFS = 'randomized depth first search',
    RANDOM = 'random',
    CELLULAR_AUTOMATON = 'cellular automaton'
}

export type OGOptionsComponentProps<T> = {
    options: T,
    setOptions: Dispatch<ReducerAction<typeof reducer>>
};

export const OG_MAP = {
    [ObstructionGenerator.DFS]: OGRandomizedDepthFirstSearch,
    [ObstructionGenerator.RANDOM]: OGRandom,
    [ObstructionGenerator.CELLULAR_AUTOMATON]: OGCellularAutomaton
} as const;

export const OG_OPTIONS_COMPONENT_MAP = {
    [ObstructionGenerator.DFS]: OGDFSOptionsComponent,
    [ObstructionGenerator.RANDOM]: OGRandomOptionsComponent,
    [ObstructionGenerator.CELLULAR_AUTOMATON]: OGCellularAutomatonOptionsComponent
} as const;

export const OG_DEFAULT_OPTIONS_MAP = {
    [ObstructionGenerator.DFS]: {},
    [ObstructionGenerator.RANDOM]: RANDOM_DEFAULT_OPTIONS,
    [ObstructionGenerator.CELLULAR_AUTOMATON]: CA_DEFAULT_OPTIONS
} as const;

export type ObstructionGeneratorOptions = ValueOf<typeof OG_DEFAULT_OPTIONS_MAP>;
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
        OG_DEFAULT_OPTIONS_MAP[generator]
    );

    const Element = useCallback(() => {
        const Element = OG_OPTIONS_COMPONENT_MAP[generator];
        // @ts-ignore
        return <Element options={options} setOptions={setOptions} key={generator} />;
        // we need to reassign Element only after `options` has changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    useEffect(() => {
        setOptions({
            ...OG_DEFAULT_OPTIONS_MAP[generator],
            remount: generator !== prevGenerator
        });
        prevGenerator = generator;
    }, [generator]);

    return [
        options,
        <Element />
    ] as const;
};
