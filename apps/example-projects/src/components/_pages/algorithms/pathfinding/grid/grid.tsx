import type { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useLoading } from '../../../../../store/loading';
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

    // TODO a previous solution relied on redenderCount to be able to use state transition
    // and correct memo, investigate if still needed
    const [rerenderCount, setReRenderCount] = useState(() => 0);
    const [isPending, startTransition] = useTransition();
    const isFirstRenderRef = useRef(true);
    const setGlobalLoading = useLoading(state => state.setIsLoading);

    useEffect(() => {
        // rendering a loader fallback when isPending takes 5 times longer than not showing any fallback
        // so let's just show the default app loader
        setGlobalLoading(isPending);
    }, [isPending, setGlobalLoading]);

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }

        startTransition(() => setReRenderCount(state => state + 1));
    }, [columns, rows, origin.x, origin.y, goal.x, goal.y, isFirstRenderRef]);

    const memoizedGrid = useMemo(() => {
        console.log('rerbuilding grid', rerenderCount);
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
        // Disabled rule because we don't care about any other dependency, we need to render only when this changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerenderCount]);

    return memoizedGrid;
};

export default memo(Grid);
