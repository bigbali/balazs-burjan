import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, startTransition, useState } from 'react';
import type { Coordinate } from './util/common';

export type NodeProps = {
    x: number,
    y: number,
    isOrigin: boolean,
    isGoal: boolean,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>,
    gridRef: MutableRefObject<HTMLDivElement>,
    setVisitedRef: MutableRefObject<Dispatch<SetStateAction<boolean>>>,
    isObstructionRef: MutableRefObject<boolean>
};

const Node = ({
    x,
    y,
    gridRef,
    setVisitedRef,
    isObstructionRef,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal
}: NodeProps) => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isVisited, setIsVisited] = useState(false);
    const [isObstruction, setIsObstruction] = useState(false);
    setVisitedRef.current = setIsVisited;
    isObstructionRef.current = isObstruction;

    return (
        <div
            ref={gridRef}
            onClick={() => setIsShowMenu(state => !state)}
            className={
                `aspect-square border bg-slate-500 relative
                ${isOrigin ? '!bg-sky-800' : ''}
                ${isGoal ? '!bg-green-700' : ''}
                ${isObstruction ? '!bg-black' : ''}
                ${isVisited ? '!bg-purple-700' : ''}`
            }
            style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1
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
