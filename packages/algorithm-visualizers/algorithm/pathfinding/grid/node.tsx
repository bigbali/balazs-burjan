import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useEffect } from 'react';
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
    isObstructionRef: MutableRefObject<boolean>,
    weightRef: MutableRefObject<[number | null, Dispatch<SetStateAction<number | null>>]>
};

const Node = ({
    x,
    y,
    setIsVisitedRef,
    setIsHighlightedRef,
    isObstructionRef,
    weightRef,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal
}: NodeProps) => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isVisited, setIsVisited] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isObstruction, setIsObstruction] = useState(false);
    const weight = useState<number | null>(null);
    setIsVisitedRef.current = setIsVisited;
    setIsHighlightedRef.current = setIsHighlighted;
    isObstructionRef.current = isObstruction;
    weightRef.current = weight;

    // useEffect(() => console.log(weight[0]), [weight]);
    // console.log(weight[0]), [weight];

    return (
        <div
            onClick={() => setIsShowMenu(state => !state)}
            className={
                `aspect-square border bg-slate-500 relative transform-gpu  transition
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
                backgroundColor: !!weight[0]
                    ? `rgb(128, 128, ${(255 - weight[0])})`
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
