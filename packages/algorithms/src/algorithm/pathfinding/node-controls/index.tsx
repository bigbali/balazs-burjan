import type Konva from 'konva';
import type { Dispatch, SetStateAction } from 'react';
import { memo, startTransition, useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { position } from './position';
import { NodeColor } from '../grid/node-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

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
    nodeIsObstruction: boolean,
    setGrid: Set<NodeControlsMenuStore['grid']>,
    setNodeRef: Set<NodeControlsMenuStore['node']>,
    setNodeSize: Set<NodeControlsMenuStore['nodeSize']>,
    setNodeIsOrigin: Set<NodeControlsMenuStore['nodeIsOrigin']>,
    setNodeIsTarget: Set<NodeControlsMenuStore['nodeIsTarget']>,
    setNodeIsObstruction: Set<NodeControlsMenuStore['nodeIsObstruction']>,
    nodeSetOrigin: Callback,
    nodeSetTarget: Callback,
    setNodeSetOrigin: SetCallback,
    setNodeSetTarget: SetCallback,
    nodeSetObstruction: Callback<Dispatch<SetStateAction<boolean>>>,
    nodeSetHighlight: Callback<Dispatch<SetStateAction<boolean>>>,
    setNodeSetObstruction: SetCallback<NodeControlsMenuStore['nodeSetObstruction']>,
    setNodeSetHighlight: SetCallback<NodeControlsMenuStore['nodeSetHighlight']>
};

const initialCb = () => undefined;

// @ts-ignore we've got a TypeScript bug here as it randomly seems to throw type errors
// then forget about them, just as randomly
export const useNodeControlsMenu = create<NodeControlsMenuStore>()(devtools((set) => ({
    grid: null,
    node: null,
    nodeSize: 0,
    nodeIsOrigin: false,
    nodeIsTarget: false,
    nodeIsObstruction: false,
    setGrid: (grid) => set(() => ({ grid })),
    setNodeRef: (nodeRef) => set(() => ({ node: nodeRef })),
    setNodeSize: (nodeSize) => set(() => ({ nodeSize })),
    setNodeIsOrigin: (nodeIsOrigin) => set(() => ({ nodeIsOrigin })),
    setNodeIsTarget: (nodeIsTarget) => set(() => ({ nodeIsTarget })),
    setNodeIsObstruction: (nodeIsObstruction) => set(() => ({ nodeIsObstruction })),
    nodeSetOrigin: initialCb,
    nodeSetTarget: initialCb,
    nodeSetHighlight: initialCb,
    nodeSetObstruction: initialCb,
    setNodeSetOrigin: (callback) => set(() => ({ nodeSetOrigin: callback })),
    setNodeSetTarget: (callback) => set(() => ({ nodeSetTarget: callback })),
    setNodeSetHighlight: (callback) => set(() => ({ nodeSetHighlight: callback })),
    setNodeSetObstruction: (callback) => set(() => ({ nodeSetObstruction: callback }))
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

const buttonClass = `
    text-white font-medium px-4 py-2 border border-slate-400 rounded-lg
    disabled:opacity-25 disabled:cursor-not-allowed
`;

const NodeControls = () => {
    const {
        grid,
        node,
        nodeSize,
        nodeIsOrigin,
        nodeIsTarget,
        nodeIsObstruction,
        nodeSetOrigin,
        nodeSetTarget,
        nodeSetObstruction,
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
                className='absolute border border-slate-300 bg-white rounded-lg p-2 flex flex-col gap-2'
                style={{
                    zIndex: 1,
                    ...position(node, grid, nodeSize)
                }}
            >
                {disabled && (
                    <p>
                        <span className='mr-2'>
                            <FontAwesomeIcon color='red' icon={faCircleExclamation} />
                        </span>
                        <span>
                            This node is already marked as {
                                nodeIsOrigin
                                    ? <span style={{ color: NodeColor.ORIGIN }} className='font-bold'>origin</span>
                                    : <span style={{ color: NodeColor.TARGET }} className='font-bold'>target</span>
                            }.
                        </span>
                    </p>
                )}
                {!disabled && (
                    <div className='flex flex-col gap-2'>
                        <button
                            className={buttonClass}
                            style={{ background: NodeColor.ORIGIN }}
                            onClick={() => {
                                setIsOpen(false);
                                startTransition(() => {
                                    if (nodeIsObstruction) {
                                        nodeSetObstruction(false);
                                    }
                                    nodeSetOrigin();
                                });
                            }}
                        >
                            Set Origin
                        </button>
                        <button
                            className={buttonClass}
                            style={{ background: NodeColor.TARGET }}
                            onClick={() => {
                                setIsOpen(false);
                                startTransition(() => {
                                    nodeSetTarget();
                                });
                            }}
                        >
                            Set Target
                        </button>
                        <button
                            className={buttonClass}
                            style={{
                                background: nodeIsObstruction
                                    ? NodeColor.DEFAULT
                                    : NodeColor.OBSTRUCTION,
                                color: nodeIsObstruction
                                    ? 'black'
                                    : undefined
                            }}
                            onClick={() => {
                                setIsOpen(false);
                                startTransition(() => {
                                    nodeSetObstruction(state => !state);
                                });
                            }}
                        >
                            {
                                nodeIsObstruction
                                    ? 'Clear'
                                    : 'Obstruct'
                            }
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default memo(NodeControls);