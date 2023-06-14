import type { Dispatch, FC, SetStateAction } from 'react';
import { Fragment, lazy, useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { memo } from 'react';
import type { Coordinate } from '../../../util/common';
import type { NodeReferences } from './../index';
import { Layer, Rect, Stage } from 'react-konva';
import Node from './node';
import { Html } from 'react-konva-utils';
import NodeControls from '../node-controls';

type GridData = {
    columns: number,
    rows: number,
    nodes: NodeReferences[][],
    origin: Coordinate,
    goal: Coordinate,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>
};

type GridProps = {
    data: GridData
};

type RowProps = {
    data: Omit<GridData, 'rows'> & {
        row: number,
        nodeSize: number
    }
};

const Row: FC<RowProps> = ({ data }) => {
    const {
        columns,
        row,
        nodes,
        origin,
        goal,
        nodeSize,
        setOrigin,
        setGoal
    } = data;

    const columnElements = new Array(columns);

    for (let column = 0; column < columns; column++) {
        columnElements[column] = (
            <Node
                key={`${column},${row}`}
                x={column}
                y={row}
                nodeSize={nodeSize}
                isOrigin={column === origin.x && row === origin.y}
                setOrigin={setOrigin}
                isGoal={column === goal.x && row === goal.y}
                setGoal={setGoal}
                setIsVisitedRef={nodes[row]![column]!.setIsVisited}
                setIsHighlightedRef={nodes[row]![column]!.setIsHighlighted}
                obstructionRef={nodes[row]![column]!.obstruction}
                weightRef={nodes[row]![column]!.weight}
                resetRef={nodes[row]![column]!.reset}
            />
        );
    }

    return (
        <Fragment key={row}>
            {columnElements}
        </Fragment>
    );
};

const Grid: FC<GridProps> = ({ data }) => {
    const {
        rows,
        columns,
        ...gridData
    } = data;

    const gridRef = useRef<HTMLDivElement>(null);
    const [gridDimensions, setGridDimensions] = useState({
        x: 0,
        y: 0
    });

    // NOTE useMemo?
    const nodeSize = Math.min(gridDimensions.x / columns, gridDimensions.y / rows);
    const rowElements = new Array(rows);

    for (let row = 0; row < rows; row++) {
        rowElements[row] = (
            <Row
                key={row}
                data={{
                    nodeSize,
                    row,
                    columns,
                    ...gridData
                }}
            />
        );
    }

    useEffect(() => {
        if (!gridRef.current) return;

        setGridDimensions({
            x: gridRef.current.scrollWidth,
            y: gridRef.current.scrollHeight
        });
    }, [rows, columns]);

    return (
        <div className='mr-8 h-full' ref={gridRef}>
            <NodeControls />
            <Stage
                className='mx-auto max-h-full max-w-full'
                width={gridDimensions.x / columns * columns}
                height={gridDimensions.y / rows * rows}
            >
                <Layer>
                    {rowElements}
                </Layer>
            </Stage>
        </div>
    );
};

export default memo(Grid);
