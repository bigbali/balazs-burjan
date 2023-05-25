import { useEffect, useState } from 'react';
import type { BeginBFS } from './bfs';
import { beginBFS, resetBFS } from './bfs';
import { BFSDirection } from './bfs/direction';
import { BFSOptions } from './bfs/options';
import type { BeginDFS } from './dfs';
import { beginDFS, resetDFS } from './dfs';
import { DFSDirection } from './dfs/direction';
import { DFSOptions } from './dfs/options';
import type { BeginDijkstra } from './dijkstra';
import { beginDijkstra, resetDijkstra } from './dijkstra';
import { dijkstraDefaultOptions, DijkstraOptions } from './dijkstra/options';

export enum Pathfinder {
    BREADTH_FIRST = 'breadth first',
    DEPTH_FIRST = 'depth first',
    DIJKSTRA = 'dijkstra',
    BIDIRECTIONAL = 'bidirectional'
}

const DEFAULT_OPTION = {
    [Pathfinder.BREADTH_FIRST]: BFSDirection.ORTHOGONAL,
    [Pathfinder.DEPTH_FIRST]: DFSDirection.TBLR,
    [Pathfinder.DIJKSTRA]: dijkstraDefaultOptions,
    [Pathfinder.BIDIRECTIONAL]: undefined
} as const;

type PathfinderMap = {
    [Pathfinder.BREADTH_FIRST]: BeginBFS,
    [Pathfinder.DEPTH_FIRST]: BeginDFS,
    [Pathfinder.DIJKSTRA]: BeginDijkstra,
    [Pathfinder.BIDIRECTIONAL]: (...args: any[]) => Promise<void>
};

export const PATHFINDER_MAP: PathfinderMap = {
    [Pathfinder.BREADTH_FIRST]: beginBFS,
    [Pathfinder.DEPTH_FIRST]: beginDFS,
    [Pathfinder.DIJKSTRA]: beginDijkstra,
    [Pathfinder.BIDIRECTIONAL]: async () => { }
} as const;

const ALGORITHM_OPTIONS_MAP = {
    [Pathfinder.BREADTH_FIRST]: BFSOptions,
    [Pathfinder.DEPTH_FIRST]: DFSOptions,
    [Pathfinder.DIJKSTRA]: DijkstraOptions,
    [Pathfinder.BIDIRECTIONAL]: ({ }: any) => (
        <h1 className='text-2xl'>
            Bidirectional options
        </h1>
    )
} as const;

export const RESET_MAP = {
    [Pathfinder.BREADTH_FIRST]: resetBFS,
    [Pathfinder.DEPTH_FIRST]: resetDFS,
    [Pathfinder.DIJKSTRA]: resetDijkstra,
    [Pathfinder.BIDIRECTIONAL]: () => () => { }
} as const;

export const usePathfinderOptions = (algorithm: Pathfinder) => {
    const [options, setOptions] = useState(DEFAULT_OPTION[algorithm]);

    useEffect(() => {
        setOptions(DEFAULT_OPTION[algorithm]);
    }, [algorithm]);

    const Element = ALGORITHM_OPTIONS_MAP[algorithm];

    return [
        options,
        () => <Element options={options} setOptions={setOptions} />
    ] as const;
};

