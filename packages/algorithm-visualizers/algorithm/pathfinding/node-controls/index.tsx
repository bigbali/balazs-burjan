import type Konva from 'konva';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { createContext, createRef, startTransition, useEffect, useRef, useState } from 'react';
import type { Coordinate } from '../../../util/common';
import { create } from 'zustand';

type NodeControlsMenuStore = {
    nodeRef: RefObject<Konva.Rect>,
    nodeSize: number,
    setNodeRef: (newNodeRef: NodeControlsMenuStore['nodeRef']) => void,
    setNodeSize: (newNodeSize: number) => void
    setOriginCallback: () => void,
    setGoalCallback: () => void,
    setOrigin: (callback: () => void) => void,
    setGoal: (callback: () => void) => void
};

export const useNodeControlsMenu = create<NodeControlsMenuStore>((set) => ({
    nodeRef: createRef(),
    nodeSize: 0,
    setNodeRef: (nodeRef) => set(() => ({ nodeRef })),
    setNodeSize: (nodeSize) => set(() => ({ nodeSize })),
    setOriginCallback: () => { },
    setGoalCallback: () => { },
    setOrigin: (callback) => set(() => ({ setOriginCallback: callback })),
    setGoal: (callback) => set(() => ({ setGoalCallback: callback }))
}));

const NodeControls = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const prevNodeRef = useRef<Konva.Rect | null>();

    const {
        nodeRef,
        nodeSize,
        setOriginCallback,
        setGoalCallback
    } = useNodeControlsMenu();

    useEffect(() => {
        if (nodeRef.current) {
            setIsExpanded(prevNodeRef.current !== nodeRef.current);
        }

        prevNodeRef.current = nodeRef.current;
    }, [nodeRef]);

    if (isExpanded) {
        return (
            <div
                className='absolute bg-yellow-500 p-4 w-30 h-30 flex flex-col'
                style={{
                    zIndex: 1,
                    left: nodeRef.current
                        ? nodeRef.current.x() + nodeSize
                        : 0,
                    top: nodeRef.current
                        ? nodeRef.current.y() + nodeSize
                        : 0
                }}
            >
                <button
                    className='bg-sky-800 text-white px-4 py-2 border-none'
                    onClick={() => {
                        if (setOriginCallback) {
                            startTransition(() => setOriginCallback());
                        }
                    }}
                >
                    Set Starting Point
                </button>
                <button
                    className='bg-green-700 text-white px-4 py-2 border-none'
                    onClick={() => {
                        if (setGoalCallback) {
                            startTransition(() => setGoalCallback());
                        }
                    }}
                >
                    Set Goal Point
                </button>
                {/* <button
                    className='bg-black text-white px-4 py-2 border-none'
                    onClick={() => setIsObstruction(state => !state)}
                >
                    Set Obstruction
                </button> */}
            </div>
        );
    }

    return null;


};

export default NodeControls;