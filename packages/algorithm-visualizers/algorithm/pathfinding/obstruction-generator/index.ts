import { PlaceholderElement } from '..';
import { beginCAMazeObstructionGenerator } from './ca-maze';
import { beginCAObstructionGenerator } from './cellular-automata';
import { CAOptions, CA_DEFAULT_OPTIONS } from './cellular-automata/options';
import { beginDFSObstructionGenerator } from './dfs';
import { beginRandomObstructionGenerator } from './random';

export enum ObstructionGenerator {
    DFS = 'randomized depth first search',
    RANDOM = 'random',
    CELLULAR_AUTOMATA = 'cellular automata',
    // CELLULAR_AUTOMATA_MAZE = 'cellular automata: maze',
    // CELLULAR_AUTOMATA_MAZECTRIC = 'cellular automata: mazectric'
};

export const OBSTRUCTION_GENERATOR_MAP = {
    [ObstructionGenerator.DFS]: beginDFSObstructionGenerator,
    [ObstructionGenerator.RANDOM]: beginRandomObstructionGenerator,
    [ObstructionGenerator.CELLULAR_AUTOMATA]: beginCAObstructionGenerator
    // [ObstructionGenerator.CELLULAR_AUTOMATA_MAZE]: beginCAMazeObstructionGenerator,
    // [ObstructionGenerator.CELLULAR_AUTOMATA_MAZECTRIC]: beginCAMazectricObstructionGenerator
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

export const DEFAULT_OBSTRUCTION_GENERATOR = ObstructionGenerator.CELLULAR_AUTOMATA;