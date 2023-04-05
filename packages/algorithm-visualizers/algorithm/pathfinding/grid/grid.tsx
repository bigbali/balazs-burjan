import type { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';
import type { Coordinate } from '../../../util/common';
import type { NodeReferences } from './../index';
import Row from './row';

type GridProps = {
    data: {
        columns: number,
        rows: number,
        nodes: NodeReferences[][],
        origin: Coordinate,
        goal: Coordinate,
        setOrigin: Dispatch<SetStateAction<Coordinate>>,
        setGoal: Dispatch<SetStateAction<Coordinate>>
    }
};

const Grid = ({ data }: GridProps) => {
    const {
        columns,
        rows,
        nodes,
        origin,
        goal,
        setOrigin,
        setGoal
    } = data;

    const elements = new Array(rows);

    for (let row = 0; row < rows; row++) {
        elements.push(
            <Row
                key={row}
                data={{
                    columns,
                    rowIndex: row,
                    origin,
                    goal,
                    nodes,
                    setOrigin,
                    setGoal
                }}
            />
        );
    }

    return (
        <div
            className='grid h-full gap-px'
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
        >
            {elements}
        </div>
    );
};

export default memo(Grid);
