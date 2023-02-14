import type { Dispatch, SetStateAction } from 'react';
import { Fragment, memo } from 'react';
import type { Nodes2 } from '../../algorithms-page';
import type { Coordinate } from '../../util/common';
import Node from './node';

type RowProps = {
    data: {
        columns: number,
        rowIndex: number,
        nodes: Nodes2[][],
        origin: Coordinate,
        goal: Coordinate,
        setOrigin: Dispatch<SetStateAction<Coordinate>>,
        setGoal: Dispatch<SetStateAction<Coordinate>>
    },

};

const Row = ({ data }: RowProps) => {
    const {
        columns,
        rowIndex,
        nodes,
        origin,
        goal,
        setOrigin,
        setGoal
    } = data;

    const elements = [];
    for (let column = 0; column < columns; column++) {
        elements.push(
            <Node
                key={`${column},${rowIndex}`}
                x={column}
                y={rowIndex}
                isOrigin={column === origin.x && rowIndex === origin.y}
                setOrigin={setOrigin}
                isGoal={column === goal.x && rowIndex === goal.y}
                setGoal={setGoal}
                setIsVisitedRef={nodes[rowIndex]![column]!.setIsVisited}
                setIsHighlightedRef={nodes[rowIndex]![column]!.setIsHighlighted}
                isObstructionRef={nodes[rowIndex]![column]!.isObstruction}
            />
        );
    }
    return (
        <Fragment key={rowIndex}>
            {elements}
        </Fragment>
    );
};

export default memo(Row);
