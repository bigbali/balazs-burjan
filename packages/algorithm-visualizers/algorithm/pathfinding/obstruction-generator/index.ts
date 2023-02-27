import { beginCAMazeObstructionGenerator } from './ca-maze';
import { beginCAMazectricObstructionGenerator } from './ca-mazectric';
import { beginDFSObstructionGenerator } from './dfs';
import { beginRandomObstructionGenerator } from './random';

export enum ObstructionGenerator {
    DFS = 'randomized depth first search',
    RANDOM = 'random',
    CELLULAR_AUTOMATA_MAZE = 'cellular automata: maze',
    CELLULAR_AUTOMATA_MAZECTRIC = 'cellular automata: mazectric'
};

export const OBSTRUCTION_GENERATOR_MAP = {
    [ObstructionGenerator.DFS]: beginDFSObstructionGenerator,
    [ObstructionGenerator.RANDOM]: beginRandomObstructionGenerator,
    [ObstructionGenerator.CELLULAR_AUTOMATA_MAZE]: beginCAMazeObstructionGenerator,
    [ObstructionGenerator.CELLULAR_AUTOMATA_MAZECTRIC]: beginCAMazectricObstructionGenerator
} as const;