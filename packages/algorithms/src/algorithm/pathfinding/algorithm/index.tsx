import { useEffect, useState } from 'react';
import { beginBFS, resetBFS } from './bfs';
import { BFSDirection } from './bfs/direction';
import { BFSOptions } from './bfs/options';
import { beginDFS, resetDFS } from './dfs';
import { DFSDirection } from './dfs/direction';
import { DFSOptions } from './dfs/options';
import { beginDijkstra, resetDijkstra } from './dijkstra';
import { dijkstraDefaultOptions, DijkstraOptions } from './dijkstra/options';
import type { Entry } from '../../../util/algorithm';

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
};

export const PATHFINDER_MAP = {
    [Pathfinder.BREADTH_FIRST]: beginBFS,
    [Pathfinder.DEPTH_FIRST]: beginDFS,
    [Pathfinder.DIJKSTRA]: beginDijkstra,
    // eslint-disable-next-line @typescript-eslint/require-await
    [Pathfinder.BIDIRECTIONAL]: async () => ({} as Entry)
} as const;

const ALGORITHM_OPTIONS_MAP = {
    [Pathfinder.BREADTH_FIRST]: BFSOptions,
    [Pathfinder.DEPTH_FIRST]: DFSOptions,
    [Pathfinder.DIJKSTRA]: DijkstraOptions,
    [Pathfinder.BIDIRECTIONAL]: (...args: any[]) => (
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

