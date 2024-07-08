import { useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NodeColor } from '../../type';
import { Coordinate } from '../../../../util/type';
import type Node from '../../../../renderer/node';

type SelectedNodeStore = {
    selectedNode: Node | null,
    setSelectedNode: (node: Node) => void
};

export const useNodeStore = create<SelectedNodeStore>(set => ({
    selectedNode: null,
    setSelectedNode: (node) => set({ selectedNode: node })
}));

let skipEffect = true;
const useNodeControlsMenuLogic = (node: Node | null) => {
    const [isOpen, _setIsOpen] = useState(false);

    const setIsOpen = useCallback<typeof _setIsOpen>((args) => {
        skipEffect = !skipEffect;
        _setIsOpen(args);
    }, []);

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

    }, [node]);

    useEffect(() => {
        node?.setHighlighted(isOpen);
        return () => node?.setHighlighted(false);
    }, [isOpen, node]);

    return [isOpen, setIsOpen] as const;
};

const buttonClass = `
    text-white font-medium px-4 py-2 border border-slate-400 rounded-lg
    disabled:opacity-25 disabled:cursor-not-allowed
`;

type NodeControlsProps = {
    position: Coordinate | null
};

const NodeControls = ({ position }: NodeControlsProps) => {
    const node = useNodeStore(state => state.selectedNode);
    const [isOpen, setIsOpen] = useNodeControlsMenuLogic(node);

    if (!node || !position) {
        return null;
    }

    type NodeMethod = () => void;
    const set = function<T extends NodeMethod>(callback: T){
        return () => {
            callback();
            setIsOpen(false);
        };
    };

    const disabled = node?.isTarget || node?.isOrigin;

    if (isOpen) {
        return (
            <div
                className='absolute flex flex-col gap-2 p-2 bg-white border rounded-lg w-max border-slate-300 '
                style={{
                    zIndex: 1,
                    top: position.y,
                    left: position.x
                }}
            >
                {disabled && (
                    <p>
                        <span className='mr-2'>
                            <FontAwesomeIcon
                                color='red'
                                icon={faCircleExclamation}
                            />
                        </span>
                        <span>
                            This node is already marked as{' '}
                            {node.isOrigin ? (
                                <span
                                    style={{ color: NodeColor.ORIGIN }}
                                    className='font-bold'
                                >
                                    origin
                                </span>
                            ) : (
                                <span
                                    style={{ color: NodeColor.TARGET }}
                                    className='font-bold'
                                >
                                    target
                                </span>
                            )}
                            .
                        </span>
                    </p>
                )}
                {!disabled && (
                    <div className='flex flex-col gap-2'>
                        <button
                            className={buttonClass}
                            style={{ background: NodeColor.ORIGIN }}
                            onClick={set(() => node.setOrigin())}
                        >
                            Set Origin
                        </button>
                        <button
                            className={buttonClass}
                            style={{ background: NodeColor.TARGET }}
                            onClick={set(() => node.setTarget())}
                        >
                            Set Target
                        </button>
                        <button
                            className={buttonClass}
                            style={{
                                background: node?.isObstruction
                                    ? NodeColor.DEFAULT
                                    : NodeColor.OBSTRUCTION,
                                color: node?.isObstruction ? 'black' : undefined
                            }}
                            onClick={set(() =>
                                node.setObstruction(!node.isObstruction)
                            )}
                        >
                            {node.isObstruction ? 'Clear' : 'Obstruct'}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default NodeControls;