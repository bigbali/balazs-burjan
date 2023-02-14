import type {
    Dispatch,
    MutableRefObject,
    SetStateAction
} from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { createRef } from 'react';
import { startTransition } from 'react';
import React, { useMemo, useState } from 'react';
import type { Coordinate } from '../util/common';
import { forEachNode } from '../util/common';
import type { BeginBreadthFirstSearch } from './algorithm/bfs';
import { beginBFS } from './algorithm/bfs';
import { BFSDirection, BFSOptions } from './algorithm/bfs';
import type { BeginDepthFirstSearch } from './algorithm/dfs';
import { DFSOptions } from './algorithm/dfs';
import { DFSDirection } from './algorithm/dfs';
import { beginDFS } from './algorithm/dfs';
import Grid from './grid/grid';

const DEFAULT_COLUMNS = 20;
const DEFAULT_ROWS = 20;
const DEFAULT_VELOCITY = 5;

const MIN_COLUMNS = 5;
const MIN_ROWS = 5;
const MIN_VELOCITY = 1;

const MAX_COLUMNS = 150;
const MAX_ROWS = 150;
const MAX_VELOCITY = 100;

enum PathfindingAlgorithm {
    BREADTH_FIRST = 'breadth first',
    DEPTH_FIRST = 'depth first',
    DIJKSTRA = 'dijkstra',
    BIDIRECTIONAL = 'bidirectional'
}

const DefaultOption = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BFSDirection.ORTHOGONAL,
    [PathfindingAlgorithm.DEPTH_FIRST]: DFSDirection.TBLR,
    [PathfindingAlgorithm.DIJKSTRA]: undefined,
    [PathfindingAlgorithm.BIDIRECTIONAL]: undefined
} as const;

type PlaceholderElementProps = any;
const PlaceholderElement = ({ ...props }: PlaceholderElementProps) => (
    <div>
        Placeholder!
    </div>
);

const ALGORITHM_OPTIONS_MAP = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BFSOptions,
    [PathfindingAlgorithm.DEPTH_FIRST]: DFSOptions,
    [PathfindingAlgorithm.DIJKSTRA]: PlaceholderElement,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PlaceholderElement
} as const;

const useOptions = (algorithm: PathfindingAlgorithm) => {
    const [options, setOptions] = useState(DefaultOption[algorithm]);

    useEffect(() => {
        setOptions(DefaultOption[algorithm]);
    }, [algorithm]);

    const Element = ALGORITHM_OPTIONS_MAP[algorithm];

    return [
        options,
        () => <Element option={options} setOption={setOptions} />
    ] as const;
};

export type Nodes2 = {
    setIsVisited: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    setIsHighlighted: MutableRefObject<Dispatch<SetStateAction<boolean>>>;
    isObstruction: MutableRefObject<boolean>;
};

type PathfinderPlaceholder = (...args: any[]) => void;
type PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BeginBreadthFirstSearch,
    [PathfindingAlgorithm.DEPTH_FIRST]: BeginDepthFirstSearch,
    [PathfindingAlgorithm.DIJKSTRA]: PathfinderPlaceholder,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PathfinderPlaceholder
};

const PATHFINDER_MAP: PathFinderMap = {
    [PathfindingAlgorithm.BREADTH_FIRST]: (...args) => beginBFS(...args),
    [PathfindingAlgorithm.DEPTH_FIRST]: (...args) => beginDFS(...args),
    [PathfindingAlgorithm.DIJKSTRA]: () => { },
    [PathfindingAlgorithm.BIDIRECTIONAL]: () => { }
} as const;

const PathfindingAlgorithms = () => {
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS);
    const [rows, setRows] = useState(() => DEFAULT_ROWS);
    const [velocity, setVelocity] = useState(() => DEFAULT_VELOCITY);
    const [algorithm, setAlgorithm] = useState(() => PathfindingAlgorithm.BREADTH_FIRST);

    const [options, OptionsElement] = useOptions(algorithm);

    const velocityRef = useRef(velocity);
    const shouldDebounceGrid = useRef(false);

    const [origin, setOrigin] = useState<Coordinate>({
        x: 0,
        y: 0
    });
    const [goal, setGoal] = useState<Coordinate>({
        x: columns - 1,
        y: rows - 1
    });

    // TODO why not combine this and table ([{ element: <Node ... />, x, y, ... }])
    // if not possible, another solution surely exists
    const nodes = useMemo(() => {
        const refs: Nodes2[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: Nodes2[] = [];
            refs.push(row);

            for (let x = 0; x < columns; x++) {
                row.push({
                    setIsVisited: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    setIsHighlighted: createRef() as MutableRefObject<
                        Dispatch<SetStateAction<boolean>>
                    >,
                    isObstruction: createRef() as MutableRefObject<boolean>
                });
            }
        }

        return refs;
    }, [columns, rows]);

    const initiate = () => {

        if (algorithm) {
            PATHFINDER_MAP[algorithm](
                origin,
                goal,
                nodes,
                velocityRef,
                // @ts-ignore
                options
            );
        }
    };

    const resetGrid = () => {
        forEachNode(nodes, (node) => node.setIsVisited.current(false));
    };

    const gridOptions = useMemo(() => ({
        columns, rows, nodes, origin, goal, setOrigin, setGoal
    }), [columns, goal, nodes, origin, rows]);

    return (
        <div>
            <h1>Algorithms</h1>
            <OptionsElement />
            <div>
                <label htmlFor='columns'>Columns</label>
                <input
                    type='range'
                    max={MAX_COLUMNS}
                    min={MIN_COLUMNS}
                    step={1}
                    value={columns}
                    onChange={(e) => {
                        shouldDebounceGrid.current = true;
                        startTransition(() => setColumns(Number.parseInt(e.currentTarget.value)));
                    }}
                />
                <input
                    type='number'
                    id='columns'
                    max={MAX_COLUMNS}
                    min={MIN_COLUMNS}
                    step={1}
                    value={columns}
                    onChange={(e) => {
                        shouldDebounceGrid.current = false;
                        startTransition(() => setColumns(Number.parseInt(e.currentTarget.value)));
                    }}
                />
            </div>
            <label htmlFor='rows'>Rows {rows}</label>
            <input
                type='range'
                id='rows'
                max={MAX_ROWS}
                min={MIN_ROWS}
                step={1}
                value={rows}
                onChange={(e) =>
                    startTransition(() =>
                        setRows(Number.parseInt(e.currentTarget.value))
                    )
                }
            />
            <label htmlFor='velocity'>Velocity {velocity}</label>
            <input
                type='range'
                id='velocity'
                max={MAX_VELOCITY}
                min={MIN_VELOCITY}
                step={1}
                value={velocity}
                onChange={(e) =>
                    startTransition(() => {
                        const value = Number.parseInt(e.currentTarget.value);
                        velocityRef.current = value;
                        setVelocity(value);
                    })
                }
            />
            <label htmlFor='algorithm' className='capitalize'>
                Algorithm {algorithm}
            </label>
            <select
                id='algorithm'
                className='border border-black capitalize'
                value={algorithm}
                onChange={(e) =>
                    startTransition(() =>
                        setAlgorithm(e.currentTarget.value as PathfindingAlgorithm)
                    )
                }
            >
                {Object.values(PathfindingAlgorithm).map((value) => {
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
            <button onClick={initiate}>Initiate</button>
            <button onClick={resetGrid}>Reset Grid</button>
            <Grid
                data={gridOptions}
                shouldDebounce={shouldDebounceGrid}
            />
        </div>
    );
};

export default PathfindingAlgorithms;
