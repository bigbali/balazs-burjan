import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, useRef, useState } from 'react';
import type { Coordinate } from '../../../util/common';
import { Rect } from 'react-konva';
import type Konva from 'konva';
import { useNodeControlsMenu } from '../node-controls';
import { GRID_MARGIN } from './grid';
import { NodeColor } from './node-color';
import { NodeSelectionMode, useNodeSelectionMode } from '../node-selection-mode';


// FIXME wtf is this

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
    resetRef: MutableRefObject<() => void>,
    nodeSize: number
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
    nodeSize,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal
}: NodeProps) => {
    const [isVisited, setIsVisited] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [obstructionState, isObstruction, setIsObstruction] = useForwardedState(false);
    const [weightState, weight, setWeight] = useForwardedState<number | null>(null);
    setIsVisitedRef.current = setIsVisited;
    setIsHighlightedRef.current = setIsHighlighted;
    obstructionRef.current = obstructionState;
    weightRef.current = weightState;

    const nodeRef = useRef<Konva.Rect>(null);

    const reset = () => {
        setIsVisited(false);
        setIsHighlighted(false);
        setIsObstruction(false);
        setWeight(null);
    };

    resetRef.current = reset;

    const setNodeRef = useNodeControlsMenu(state => state.setNodeRef);
    const setNodeSize = useNodeControlsMenu(state => state.setNodeSize);
    const setNodeIsOrigin = useNodeControlsMenu(state => state.setNodeIsOrigin);
    const setNodeIsTarget = useNodeControlsMenu(state => state.setNodeIsTarget);
    const setNodeIsObstruction = useNodeControlsMenu(state => state.setNodeIsObstruction);
    const setOriginSetter = useNodeControlsMenu(state => state.setNodeSetOrigin);
    const setTargetSetter = useNodeControlsMenu(state => state.setNodeSetTarget);
    const setObstructionSetter = useNodeControlsMenu(state => state.setNodeSetObstruction);
    const setNodeHighlightSetter = useNodeControlsMenu(state => state.setNodeSetHighlight);

    const getNodeSelectionMode = useNodeSelectionMode(state => state.getNodeSelectionMode);

    const [isHighlightedByMenu, setIsHighlightedByMenu] = useState(false);

    const setMenuOriginCallback = () => setOrigin({ x, y });
    const setMenuGoalCallback = () => setGoal({ x, y });

    const updateMenu = () => {
        if (getNodeSelectionMode() !== NodeSelectionMode.MENU)
            return;

        setNodeRef(nodeRef.current);
        setNodeSize(nodeSize);
        setNodeIsOrigin(isOrigin);
        setNodeIsTarget(isGoal);
        setNodeIsObstruction(isObstruction);
        setOriginSetter(setMenuOriginCallback);
        setTargetSetter(setMenuGoalCallback);
        setObstructionSetter(setIsObstruction);
        setNodeHighlightSetter(setIsHighlightedByMenu);
        nodeRef.current?.moveToTop();
    };

    const fill = (() => {
        if (isHighlighted && !isOrigin && !isGoal && !isObstruction) return NodeColor.HIGHLIGHT_BACKTRACE;
        if (isOrigin) return NodeColor.ORIGIN;
        if (isGoal) return NodeColor.TARGET;
        if (isVisited) return NodeColor.VISITED;
        if (isObstruction) return NodeColor.OBSTRUCTION;

        if (weight !== null) {
            const r = 255 - weight;
            const g = Math.max((128 - weight) * 2, 30);
            const b = Math.max((128 - weight) * 2, 60);

            return `rgb(${r}, ${g}, ${b})`;
        }

        return NodeColor.DEFAULT;
    })();

    return (
        <Rect
            key={`${x}${y}`}
            x={nodeSize * x + GRID_MARGIN}
            y={nodeSize * y + GRID_MARGIN}
            width={nodeSize}
            height={nodeSize}
            fill={fill}
            stroke={
                isHighlightedByMenu
                    ? NodeColor.HIGHLIGHT_SELECTED
                    : NodeColor.OUTLINE
            }
            strokeWidth={
                isHighlightedByMenu
                    ? 5
                    : 0.25
            }
            onClick={updateMenu}
            onMouseDown={() => {
                if (getNodeSelectionMode() === NodeSelectionMode.DRAW_OBSTRUCTION) {
                    setIsObstruction(true);
                }
            }}
            onMouseEnter={(e) => {
                if (e.evt.buttons > 0 && getNodeSelectionMode() === NodeSelectionMode.DRAW_OBSTRUCTION) {
                    setIsObstruction(true);
                }
            }}
            ref={nodeRef}
        />
    );
};

export default memo(Node);
