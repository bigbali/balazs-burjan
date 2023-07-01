import type Konva from 'konva';
import type { Dispatch, SetStateAction } from 'react';
import { memo, startTransition, useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { position } from './position';

type Callback<T = () => void> = T;
type SetCallback<T = Callback> = (callback: T) => void;
type Set<T> = (arg: T) => void;

/**
 * `Callback`: a function that is called on the selected node
 * `SetCallback`: a setter function that we call from the selected node to set the `Callback` for `NodeControls`
 */
export type NodeControlsMenuStore = {
    grid: HTMLDivElement | null,
    node: Konva.Rect | null,
    nodeSize: number,
    nodeIsOrigin: boolean,
    nodeIsTarget: boolean,
    setGrid: Set<NodeControlsMenuStore['grid']>,
    setNodeRef: Set<NodeControlsMenuStore['node']>,
    setNodeSize: Set<NodeControlsMenuStore['nodeSize']>,
    setNodeIsOrigin: Set<NodeControlsMenuStore['nodeIsOrigin']>,
    setNodeIsTarget: Set<NodeControlsMenuStore['nodeIsTarget']>,
    nodeSetOrigin: Callback,
    nodeSetTarget: Callback,
    setNodeSetOrigin: SetCallback,
    setNodeSetTarget: SetCallback,
    nodeSetHighlight: Callback<Dispatch<SetStateAction<boolean>>>,
    setNodeSetHighlight: SetCallback<NodeControlsMenuStore['nodeSetHighlight']>
};

const initialCb = () => undefined;

export const useNodeControlsMenu = create<NodeControlsMenuStore>()(devtools((set) => ({
    grid: null,
    node: null,
    nodeSize: 0,
    nodeIsOrigin: false,
    nodeIsTarget: false,
    setGrid: (grid) => set(() => ({ grid })),
    setNodeRef: (nodeRef) => set(() => ({ node: nodeRef })),
    setNodeSize: (nodeSize) => set(() => ({ nodeSize })),
    setNodeIsOrigin: (nodeIsOrigin) => set(() => ({ nodeIsOrigin })),
    setNodeIsTarget: (nodeIsTarget) => set(() => ({ nodeIsTarget })),
    nodeSetOrigin: initialCb,
    nodeSetTarget: initialCb,
    nodeSetHighlight: initialCb,
    setNodeSetOrigin: (callback) => set(() => ({ nodeSetOrigin: callback })),
    setNodeSetTarget: (callback) => set(() => ({ nodeSetTarget: callback })),
    setNodeSetHighlight: (callback) => set(() => ({ nodeSetHighlight: callback }))
}), {
    name: 'NodeContextMenu',
    stateSanitizer: (state) => {
        // remove grid from devtools as it is too large to process
        return {
            ...state,
            grid: null
        };
    }
}));

let skipEffect = true;
const useNodeControlsMenuLogic = (node: Konva.Rect | null) => {
    const [isOpen, _setIsOpen] = useState(false);

    const setIsOpen = useCallback<typeof _setIsOpen>((args) => {
        skipEffect = !skipEffect;
        _setIsOpen(args);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!node) return;

        if (!skipEffect) {
            _setIsOpen(state => !state);
        }

        skipEffect = !skipEffect;
    });

    useEffect(() => {
        if (!node) return;

        skipEffect = !isOpen;
        _setIsOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node]);

    return [isOpen, setIsOpen] as const;
};

const NodeControls = () => {
    const {
        grid,
        node,
        nodeSize,
        nodeIsOrigin,
        nodeIsTarget,
        nodeSetOrigin,
        nodeSetTarget,
        nodeSetHighlight
    } = useNodeControlsMenu();

    const [isOpen, setIsOpen] = useNodeControlsMenuLogic(node);

    useEffect(() => { // this highlights the selected node and resets when demounting
        nodeSetHighlight(isOpen);
        return () => nodeSetHighlight(false);
    }, [isOpen, nodeSetHighlight]);

    const disabled = nodeIsTarget || nodeIsOrigin;

    if (isOpen) {
        return (
            <div
                className='absolute border border-slate-300 bg-white rounded-lg p-4 w-30 h-30 flex flex-col'
                style={{
                    zIndex: 1,
                    ...position(node, grid, nodeSize)
                }}
            >
                <button
                    className='bg-sky-800 text-white px-4 py-2 border-none disabled:opacity-75 disabled:cursor-not-allowed'
                    onClick={() => {
                        setIsOpen(false);
                        startTransition(() => {
                            nodeSetOrigin();
                        });
                    }}
                    disabled={disabled}
                >
                    Set Starting Point
                </button>
                <button
                    className='bg-green-700 text-white px-4 py-2 border-none disabled:opacity-75 disabled:cursor-not-allowed'
                    onClick={() => {
                        setIsOpen(false);
                        startTransition(() => {
                            nodeSetTarget();
                        });
                    }}
                    disabled={disabled}
                >
                    Set Goal Point
                </button>
            </div>
        );
    }

    return null;
};

export default memo(NodeControls);