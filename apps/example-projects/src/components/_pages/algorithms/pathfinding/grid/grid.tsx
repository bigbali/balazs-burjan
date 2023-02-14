import { debounce } from 'lodash';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { startTransition } from 'react';
import { memo } from 'react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useLoading } from '../../../../../store/loading';
import type { Nodes2 } from './../index';
import { Dimensions } from './../index';
import type { Coordinate } from '../../util/common';
import Row from './row';

type SetDimensionsOptions = {
    debounce: boolean,
    setter: Dispatch<SetStateAction<number>>
};

/**
 * When user is typing a digit that is smaller than the minimum, we do not know if he is going to type another number or not.\
 * This could mean that the user is intending to type `12`, but our minimum is set to `1`. In usual input validation implementations,
 * this would cause `1` to be replaced by `min`. We are using debouncing like so to prevent this from happening.
 */
const waitForPossibleFieldInput = debounce((callback: () => void) => callback(), 500);
const waitForPossibleRangeInput = debounce((callback: () => void) => callback(), 200);

export const setGridDimensions = (e: ChangeEvent<HTMLInputElement>, { debounce, setter }: SetDimensionsOptions) => {
    // cancel pending state updates
    waitForPossibleFieldInput.cancel();

    const parsedValue = Number.parseInt(e.currentTarget.value);

    if (Number.isNaN(parsedValue)) {
        waitForPossibleFieldInput(() => {
            e.target.value = Dimensions.DEFAULT.toString();
            startTransition(() => setter(Dimensions.DEFAULT));
        });
    }

    if (parsedValue < Dimensions.MIN) {
        waitForPossibleFieldInput(() => {
            e.target.value = Dimensions.MIN.toString();
            startTransition(() => setter(Dimensions.MIN));
        });

        return;
    }

    if (parsedValue > Dimensions.MAX) {
        waitForPossibleFieldInput(() => {
            e.target.value = Dimensions.MAX.toString();
            startTransition(() => setter(Dimensions.MAX));
        });

        return;
    }

    if (parsedValue >= Dimensions.MIN && parsedValue <= Dimensions.MAX) {
        if (debounce) {
            waitForPossibleRangeInput(() => {
                e.target.value = parsedValue.toString();
                startTransition(() => setter(parsedValue));
            });

            return;
        }

        startTransition(() => setter(parsedValue));
    }
};

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
