import type { GridData } from './grid';
import { Fragment } from 'react';
import Node from './node';

export type RowProps = {
    data: Omit<GridData, 'rows'> & {
        row: number,
        nodeSize: number
    }
};

export const Row = ({ data }: RowProps) => {
    const {
        columns,
        row,
        grid,
        origin,
        target,
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
                isGoal={column === target.x && row === target.y}
                setGoal={setGoal}
                grid={grid}
            />
        );
    }

    return (
        <Fragment key={row}>
            {columnElements}
        </Fragment>
    );
};
