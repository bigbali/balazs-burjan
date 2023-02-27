import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, startTransition, useState } from 'react';
import type { Coordinate } from '../../../util/common';

export type NodeProps = {
    x: number,
    y: number,
    isOrigin: boolean,
    isGoal: boolean,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>,
    setIsVisitedRef: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    setIsHighlightedRef: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    obstructionRef: MutableRefObject<[boolean, Dispatch<SetStateAction<boolean>>]>,
    weightRef: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>,
    resetRef: MutableRefObject<() => void>
};

function useForwardedState<T>(initialState: T) {
    const state = useState(initialState);
    return [state, state[0], state[1]] as const;
}

const Node = ({
    x,
    y,
    setIsVisitedRef,
    setIsHighlightedRef,
    obstructionRef,
    weightRef,
    resetRef,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal
}: NodeProps) => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isVisited, setIsVisited] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [obstructionState, isObstruction, setIsObstruction] = useForwardedState(false);
    const [weightState, weight, setWeight] = useForwardedState<number | null>(null);
    setIsVisitedRef.current = setIsVisited;
    setIsHighlightedRef.current = setIsHighlighted;
    obstructionRef.current = obstructionState;
    weightRef.current = weightState;

    const reset = () => {
        setIsVisited(false);
        setIsHighlighted(false);
        setIsObstruction(false);
        setWeight(null);
    };

    resetRef.current = reset;

    return (
        <div
            onClick={() => setIsShowMenu(state => !state)}
            className={
                `aspect-square bg-slate-500 relative transform-gpu  transition
                ${isOrigin ? '!bg-sky-800' : ''}
                ${isGoal ? '!bg-green-700' : ''}
                ${isObstruction ? '!bg-black' : ''}
                ${isVisited ? '!bg-purple-700' : ''}
                ${isHighlighted ? '!bg-yellow-500 scale-110' : ''}
                ${isGoal && isVisited ? '!bg-pink-700' : ''}`
            }
            style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1,
                backgroundColor: !!weight
                    ? `rgb(128, 128, ${(255 - weight)})`
                    : undefined
            }}
        >
            {isShowMenu && (
                <div className='absolute bottom-full bg-yellow-500 p-4'>
                    <button
                        className='bg-sky-800 text-white px-4 py-2 border-none'
                        onClick={() => startTransition(() => setOrigin({ x, y }))}
                    >
                        Set Starting Point
                    </button>
                    <button
                        className='bg-green-700 text-white px-4 py-2 border-none'
                        onClick={() => startTransition(() => setGoal({ x, y }))}
                    >
                        Set Goal Point
                    </button>
                    <button
                        className='bg-black text-white px-4 py-2 border-none'
                        onClick={() => setIsObstruction(state => !state)}
                    >
                        Set Obstruction
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(Node);
