import { useEffect, useReducer } from 'react';
import { beginCAObstructionGenerator } from './cellular-automata';
import type { CellularAutomataOptions } from './cellular-automata/options';
import { CA_DEFAULT_OPTIONS } from './cellular-automata/options';
import CAOptions from './cellular-automata/options';
import { beginDFSObstructionGenerator } from './dfs';
import { beginRandomObstructionGenerator } from './random';

export enum ObstructionGenerator {
    DFS = 'randomized depth first search',
    RANDOM = 'random',
    CELLULAR_AUTOMATA = 'cellular automata'
};

export const OBSTRUCTION_GENERATOR_MAP = {
    [ObstructionGenerator.DFS]: beginDFSObstructionGenerator,
    [ObstructionGenerator.RANDOM]: beginRandomObstructionGenerator,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: beginCAObstructionGenerator
} as const;

export const OBSTRUCTION_GENERATOR_OPTIONS_MAP = {
    [ObstructionGenerator.DFS]: () => null,
    [ObstructionGenerator.RANDOM]: () => null,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: CAOptions
} as const;

export const OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP = {
    [ObstructionGenerator.DFS]: undefined,
    [ObstructionGenerator.RANDOM]: undefined,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: CA_DEFAULT_OPTIONS
} as const;

function reducer<T extends Partial<CellularAutomataOptions> | undefined>(current: T, update: T) {
    return {
        ...current,
        ...update
    };
};

export const useObstructionGeneratorOptions = (generator: ObstructionGenerator) => {
    const [options, setOptions] = useReducer(reducer, OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator]);

    useEffect(() => {
        setOptions(OBSTRUCTION_GENERATOR_DEFAULT_OPTIONS_MAP[generator]);
    }, [generator]);

    const Element = OBSTRUCTION_GENERATOR_OPTIONS_MAP[generator];

    return [
        options, // @ts-ignore
        () => <Element options={options} setOptions={setOptions} />
    ] as const;
};

export const DEFAULT_OBSTRUCTION_GENERATOR = ObstructionGenerator.CELLULAR_AUTOMATA;