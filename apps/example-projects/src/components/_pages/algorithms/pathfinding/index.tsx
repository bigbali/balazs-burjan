import type {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    ChangeEvent
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
import Grid, { setGridDimensions } from './grid/grid';

import FieldRangeInput from 'ui/FieldRangeInput';

export const enum Dimensions {
    MIN = 5,
    DEFAULT = 20,
    MAX = 150
};

export const enum Velocity {
    MIN = 1,
    DEFAULT = 5,
    MAX = 100
};

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
const PlaceholderElement = ({ }: PlaceholderElementProps) => (
    <h1 className='text-5xl'>
        Placeholder!
    </h1>
);

const ALGORITHM_OPTIONS_MAP = {
    [PathfindingAlgorithm.BREADTH_FIRST]: BFSOptions,
    [PathfindingAlgorithm.DEPTH_FIRST]: DFSOptions,
    [PathfindingAlgorithm.DIJKSTRA]: PlaceholderElement,
    [PathfindingAlgorithm.BIDIRECTIONAL]: PlaceholderElement
} as const;

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

const usePathfindingOptions = (algorithm: PathfindingAlgorithm) => {
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

const PathfindingAlgorithms = () => {
    const [rows, setRows] = useState(() => Dimensions.DEFAULT);
    const [columns, setColumns] = useState(() => Dimensions.DEFAULT);
    const [velocity, setVelocity] = useState(() => Velocity.DEFAULT);
    const [algorithm, setAlgorithm] = useState(() => PathfindingAlgorithm.BREADTH_FIRST);

    const [options, OptionsElement] = usePathfindingOptions(algorithm);

    const velocityRef = useRef(velocity);

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
        <div className='flex gap-4 flex-col'>
            <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4'>
                <legend className='text-center px-4'>
                    Grid Options
                </legend>
                <FieldRangeInput
                    label='TEST ROWS'
                    defaultValue={rows}
                    min={Dimensions.MIN}
                    max={Dimensions.MAX}
                    step={1}
                    onFieldChange={(e) => setGridDimensions(e, {
                        debounce: false,
                        setter: setRows
                    })}
                    onRangeChange={(e) => setGridDimensions(e, {
                        debounce: true,
                        setter: setRows
                    })}
                />
                <div className='flex gap-4'>
                    <div className='flex gap-2'>
                        <label htmlFor='rows'>
                            Rows
                        </label>
                        <input
                            type='number'
                            id='rows'
                            max={Dimensions.MAX}
                            min={Dimensions.MIN}
                            step={1}
                            defaultValue={rows}
                            onChange={(e) => setGridDimensions(e, {
                                debounce: false,
                                setter: setRows
                            })}
                            className='border border-slate-300 rounded-md text-center'
                        />
                        <input
                            type='range'
                            max={Dimensions.MAX}
                            min={Dimensions.MIN}
                            step={1}
                            defaultValue={rows}
                            onChange={(e) => setGridDimensions(e, {
                                debounce: true,
                                setter: setRows
                            })}
                        />
                    </div>
                    <div className='flex gap-2'>
                        <label htmlFor='columns'>
                            Columns
                        </label>
                        <input
                            type='number'
                            id='columns'
                            max={Dimensions.MAX}
                            min={Dimensions.MIN}
                            step={1}
                            defaultValue={columns}
                            onChange={(e) => setGridDimensions(e, {
                                debounce: false,
                                setter: setColumns
                            })}
                            className='border border-slate-300 rounded-md text-center'
                        />
                        <input
                            type='range'
                            max={Dimensions.MAX}
                            min={Dimensions.MIN}
                            step={1}
                            defaultValue={columns}
                            onChange={(e) => setGridDimensions(e, {
                                debounce: true,
                                setter: setColumns
                            })}
                        />
                    </div>
                </div>
            </fieldset>
            <fieldset className='border border-slate-300 rounded-lg px-4 pt-3 pb-4 mb-3'>
                <legend className='text-center px-4'>
                    Algorithm Options
                </legend>
                <div className='flex gap-4'>
                    <div>
                        <div className='flex gap-2'>
                            <label htmlFor='algorithm' className='capitalize'>
                                Algorithm
                            </label>
                            <select
                                id='algorithm'
                                className='border border-slate-3 rounded-md capitalize'
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
                        </div>
                        <OptionsElement />
                    </div>
                    <div>
                        <label htmlFor='velocity'>Velocity {velocity}</label>
                        <input
                            type='range'
                            id='velocity'
                            max={Velocity.MAX}
                            min={Velocity.MIN}
                            step={1}
                            value={velocity}
                            onChange={(e) => {
                                const value = Number.parseInt(e.currentTarget.value);
                                velocityRef.current = value;
                                setVelocity(value);
                            }}
                        />
                    </div>
                </div>
                <button onClick={initiate}>Initiate</button>
                <button onClick={resetGrid}>Reset Grid</button>
            </fieldset>
            <Grid
                data={gridOptions}
            // shouldDebounce={shouldDebounceGridRef}
            />
        </div>
    );
};

export default PathfindingAlgorithms;