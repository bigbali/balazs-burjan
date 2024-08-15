import type PathfinderNode from '../renderer/node';
import type { Coordinate } from '../../type';
import { useEffect } from 'react';
import { create } from 'zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NodeColor } from '../../type';

type SelectedNodeStore = {
    isOpen: boolean,
    node: PathfinderNode | null,
    openAt: (node: PathfinderNode) => void,
    close: () => void,
    toggle: (node: PathfinderNode) => void
};

export const useNodeControlsStore = create<SelectedNodeStore>(set => ({
    isOpen: false,
    node: null,
    openAt: (node) => set({ isOpen: true, node }),
    close: () => set({ isOpen: false, node: null }),
    toggle: (node) => {
        let isNewNode = true;

        set((state) => {
            isNewNode = state.node !== node;

            return { isOpen: isNewNode, node: isNewNode ? node : null };
        });
    }
}));

const buttonClass = `
    text-white font-medium px-4 py-2 border border-slate-400 rounded-lg
    disabled:opacity-25 disabled:cursor-not-allowed
`;

type NodeControlsProps = {
    position: Coordinate | null,
    container: HTMLDivElement | null
};

export default function NodeContextMenu({ position, container }: NodeControlsProps){
    'use no memo'; // react auto-memoized the node when rendering to ui, so we got stale state to node.isObstruction

    const { node, isOpen, close } = useNodeControlsStore();

    type NodeMethod = () => void;
    const set = function<T extends NodeMethod>(callback: T){
        return () => {
            callback();
            close();
        };
    };

    const disabled = node?.isTarget || node?.isOrigin;

    const calcPosition = () => {
        if (!position || !container) return {};

        const _container = container.getBoundingClientRect();

        return {
            left: position.x < _container.width / 2 ?  position.x : undefined,
            top: position.y < _container.height / 2 ?  position.y : undefined,
            right: position.x > _container.width / 2 ?  _container.width - position.x : undefined,
            bottom: position.y > _container.height / 2 ?  _container.height - position.y : undefined
        };
    };


    useEffect(() => {
        node?.setHighlighted(isOpen);
        return () => node?.setHighlighted(false);
    }, [isOpen, node]);

    if (!node || !position || !isOpen) {
        return null;
    }

    return (
        <div
            className='absolute flex flex-col gap-2 p-2 bg-white border rounded-lg w-max border-theme-border-light'
            style={{
                zIndex: 1,
                ...calcPosition()
            }}
            key={`${node.x}-${node.y}`}
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
