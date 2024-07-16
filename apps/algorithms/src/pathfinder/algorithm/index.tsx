import { useEffect, useState } from 'react';
import BreadthFirstSearch from './bfs';
import { BREADTH_FIRST_SEARCH_DEFAULT_OPTIONS, BFSOptionsComponent } from './bfs/options';
import DepthFirstSearch from './dfs';
import { DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS, DFSOptionsComponent } from './dfs/options';
import Dijkstra from './dijkstra';
import { DIJSKTRA_DEFAULT_OPTIONS as DIJKSTRA_DEFAULT_OPTIONS, DijkstraOptionsComponent } from './dijkstra/options';
import { usePathfinderRendererStore } from '../hook/usePathfinderRenderer';
import { Pathfinder } from '../../type';

export const PATHFINDER_MAP = {
    [Pathfinder.BREADTH_FIRST]: BreadthFirstSearch,
    [Pathfinder.DEPTH_FIRST]: DepthFirstSearch,
    [Pathfinder.DIJKSTRA]: Dijkstra
} as const;

const DEFAULT_OPTIONS_MAP = {
    [Pathfinder.BREADTH_FIRST]: BREADTH_FIRST_SEARCH_DEFAULT_OPTIONS,
    [Pathfinder.DEPTH_FIRST]: DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS,
    [Pathfinder.DIJKSTRA]: DIJKSTRA_DEFAULT_OPTIONS
} as const;

const ALGORITHM_OPTIONS_COMPONENT_MAP = {
    [Pathfinder.BREADTH_FIRST]: BFSOptionsComponent,
    [Pathfinder.DEPTH_FIRST]: DFSOptionsComponent,
    [Pathfinder.DIJKSTRA]: DijkstraOptionsComponent
} as const;

export const usePathfinderOptions = <T extends Pathfinder>(algorithm: T) => {
    const [options, setOptions] = useState(DEFAULT_OPTIONS_MAP[algorithm]);

    useEffect(() => {
        setOptions(DEFAULT_OPTIONS_MAP[algorithm]);
    }, [algorithm]);

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
