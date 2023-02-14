import { debounce } from 'lodash';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
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
    },
    shouldDebounce: MutableRefObject<boolean>
};

const Grid = ({ data, shouldDebounce }: GridProps) => {
    const {
        columns,
        rows,
        nodes,
        origin,
        goal,
        setOrigin,
        setGoal
    } = data;

    const [reRenderCount, setReRenderCount] = useState(() => 0);
    const [isPending, startTransition] = useTransition();
    const previousGrid = useRef<JSX.Element>();
    const isFirstRenderRef = useRef(true);
    const setGlobalLoading = useLoading(state => state.setIsLoading);

    useEffect(() => {
        // rendering a loader fallback when isPending takes 5 times longer than not showing any fallback
        // so let's just show the default app loader
        setGlobalLoading(isPending);
    }, [isPending, setGlobalLoading]);


    const debouncedRerender = useMemo(
        () => debounce(() => startTransition(() => setReRenderCount(state => state + 1)), 100),
        []
    );

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }

        if (shouldDebounce.current) {
            debouncedRerender();

            return () => {
                debouncedRerender.cancel();
            };
        }

        startTransition(() => setReRenderCount(state => state + 1));
    }, [columns, rows, origin.x, origin.y, goal.x, goal.y, debouncedRerender, shouldDebounce, isFirstRenderRef]);

    const memoizedGrid = useMemo(() => {
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

        const gridContainer = (
            <div
                className='px-64 py-32'
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

        previousGrid.current = gridContainer;
        console.log('rerendering grid', reRenderCount);

        return gridContainer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRenderCount]);

    return memoizedGrid;
};

export default memo(Grid);
