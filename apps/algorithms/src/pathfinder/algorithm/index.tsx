import { useEffect, useLayoutEffect, useState } from 'react';
import BreadthFirstSearch from './bfs';
import { BREADTH_FIRST_SEARCH_DEFAULT_OPTIONS, BFSOptionsComponent } from './bfs/options';
import DepthFirstSearch from './dfs';
import { DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS, DFSOptionsComponent } from './dfs/options';
import Dijkstra from './dijkstra';
import { DIJSKTRA_DEFAULT_OPTIONS as DIJKSTRA_DEFAULT_OPTIONS, DijkstraOptionsComponent } from './dijkstra/options';
import { usePathfinderRendererStore } from '../hook/usePathfinderRenderer';
import { Pathfinder } from '../../type';
import BidirectionalSearch from './bidir';
import { BIDIRECTIONAL_DEFAULT_OPTIONS, BidirectionalOptionsComponent } from './bidir/options';

export const PATHFINDER_MAP = {
    [Pathfinder.BREADTH_FIRST]: BreadthFirstSearch,
    [Pathfinder.DEPTH_FIRST]: DepthFirstSearch,
    [Pathfinder.DIJKSTRA]: Dijkstra,
    [Pathfinder.BIDIRECTIONAL]: BidirectionalSearch
} as const;

const DEFAULT_OPTIONS_MAP = {
    [Pathfinder.BREADTH_FIRST]: BREADTH_FIRST_SEARCH_DEFAULT_OPTIONS,
    [Pathfinder.DEPTH_FIRST]: DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS,
    [Pathfinder.DIJKSTRA]: DIJKSTRA_DEFAULT_OPTIONS,
    [Pathfinder.BIDIRECTIONAL]: BIDIRECTIONAL_DEFAULT_OPTIONS
} as const;

const ALGORITHM_OPTIONS_COMPONENT_MAP = {
    [Pathfinder.BREADTH_FIRST]: BFSOptionsComponent,
    [Pathfinder.DEPTH_FIRST]: DFSOptionsComponent,
    [Pathfinder.DIJKSTRA]: DijkstraOptionsComponent,
    [Pathfinder.BIDIRECTIONAL]: BidirectionalOptionsComponent
} as const;

export const usePathfinderOptions = <T extends Pathfinder>(algorithm: T) => {
    const [options, setOptions] = useState(() => DEFAULT_OPTIONS_MAP[algorithm]);

    useLayoutEffect(() => {
        if (options !== DEFAULT_OPTIONS_MAP[algorithm]) {
            setOptions(DEFAULT_OPTIONS_MAP[algorithm]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algorithm]),

    useEffect(() => {
        PATHFINDER_MAP[algorithm].reset();
        usePathfinderRendererStore.getState().renderer?.reset();
    }, [options, algorithm]);

    const Element = ALGORITHM_OPTIONS_COMPONENT_MAP[algorithm];

    return   [
        options, // @ts-ignore
        <Element options={options} setOptions={setOptions} />
    ] as const;
};
