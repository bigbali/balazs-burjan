import type Konva from 'konva';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { createRef, startTransition, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

type Callback<T = () => void> = T;
type SetCallback<T = Callback> = (callback: T) => void;
type Set<T> = (arg: T) => void;

/**
 * `Callback`: a function that is called on the selected node
 * `SetCallback`: a setter function that we call from the selected node to set the `Callback` for `NodeControls`
 */
type NodeControlsMenuStore = {
    nodeRef: RefObject<Konva.Rect>,
    nodeSize: number,
    setNodeRef: Set<NodeControlsMenuStore['nodeRef']>,
    setNodeSize: Set<NodeControlsMenuStore['nodeSize']>,
    nodeSetOrigin: Callback,
    nodeSetTarget: Callback,
    setNodeSetOrigin: SetCallback,
    setNodeSetTarget: SetCallback,
    nodeSetHighlight: Callback<Dispatch<SetStateAction<boolean>>>,
    setNodeSetHighlight: SetCallback<NodeControlsMenuStore['nodeSetHighlight']>
};

const initialCb = () => undefined;

export const useNodeControlsMenu = create<NodeControlsMenuStore>((set) => ({
    nodeRef: createRef(),
    nodeSize: 0,
    setNodeRef: (nodeRef) => set(() => ({ nodeRef })),
    setNodeSize: (nodeSize) => set(() => ({ nodeSize })),
    nodeSetOrigin: initialCb,
    nodeSetTarget: initialCb,
    nodeSetHighlight: initialCb,
    setNodeSetOrigin: (callback) => set(() => ({ nodeSetOrigin: callback })),
    setNodeSetTarget: (callback) => set(() => ({ nodeSetTarget: callback })),
    setNodeSetHighlight: (callback) => set(() => ({ nodeSetHighlight: callback }))
}));

const NodeControls = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const preventStateChangeRef = useRef(true);
    const isInitialRenderRef = useRef(true);
    const prevNodeRef = useRef<Konva.Rect | null>();

    const {
        nodeRef,
        nodeSize,
        nodeSetOrigin: setOriginCallback,
        nodeSetTarget: setGoalCallback,
        nodeSetHighlight: nodeHighlightCallback
    } = useNodeControlsMenu();

    // on every render, invert expanded state unless it's the initial render,
    // or unless it's a re-render caused by inverting state in previous render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isInitialRenderRef.current) {
            isInitialRenderRef.current = false;
            return;
        }

        if (!preventStateChangeRef.current) {
            setIsExpanded(!isExpanded);
        }

        preventStateChangeRef.current = !preventStateChangeRef.current;
    });

    // when we have a new nodeRef (when clicked on a new node), force the expanded state to true
    // unless node is unset
    useEffect(() => {
        if (nodeRef.current === null) {
            return;
        }

        setIsExpanded(true);

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            prevNodeRef.current = nodeRef.current;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeRef]);

    useEffect(() => { // this highlights the selected node and resets when demounting
        nodeHighlightCallback(isExpanded);
        return () => nodeHighlightCallback(false);
    }, [isExpanded, nodeHighlightCallback]);

    if (isExpanded) {
        return (
            <div
                className='absolute border border-slate-300 bg-white rounded-lg p-4 w-30 h-30 flex flex-col'
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
            </div>
        );
    }

    return null;
};

export default NodeControls;