import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
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
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isContained, setIsContained] = useState(true);
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

    const fullscreenClassName = 'absolute inset-16 max-h-screen max-w-screen object-contain';
    const containedClassName = 'absolute max-h-screen max-w-screen ';

    return (
        <div /* className={`${isFullScreen ? fullscreenClassName : isContained ? containedClassName : ''}`} */>
            <div className='mx-auto max-h-full max-w-full' style={{ aspectRatio: `${columns}/${rows}` }}>
                <button className='border border-slate-300 rounded-md px-2 py-1 mb-2'
                    onClick={() => setIsFullScreen(state => !state)}
                >
                    {isFullScreen ? 'Shrink' : 'Enlarge'}
                </button>
                <button className='border border-slate-300 rounded-md px-2 py-1 mb-2'
                    onClick={() => setIsContained(state => !state)}
                >
                    {isContained ? 'Disable contain' : 'Enable contain'}
                </button>
                <div
                    className='grid h-full gap-px bg-white'
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`
                    }}
                >
                    {elements}
                </div>
            </div>
        </div>
    );
};

export default memo(Grid);
