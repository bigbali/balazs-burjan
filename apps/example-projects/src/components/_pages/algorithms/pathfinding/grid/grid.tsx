import type { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';
import type { Nodes2 } from './../index';
import type { Coordinate } from '../../util/common';
import Row from './row';

type GridProps = {
    data: {
        columns: number,
        rows: number,
        nodes: Nodes2[][],
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

    // theoretically, this is the most performant way, and we need this performance in this case
    const elements = [];
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
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                height: '100%'
            }}
        >
            {elements}
        </div>
    );
};

export default memo(Grid);
