import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, useCallback, useRef, useState } from 'react';
import type { Coordinate } from '../../../util/common';
import { Rect } from 'react-konva';
import type Konva from 'konva';
import { useNodeControlsMenu } from '../node-controls';
import { GRID_MARGIN } from './grid';

const enum NodeColor {
    OUTLINE = 'rgb(127, 127, 127)',
    MENU_HIGHLIGHT_OUTLINE = 'rgb(255, 0, 89)',
    BACKTRACE_HIGHLIGHT = 'orange',
    ORIGIN = 'rgb(32, 200, 80)',
    TARGET = 'rgb(30, 128, 230)',
    VISITED = 'rgb(190, 210, 210)',
    OBSTRUCTION = 'rgb(30, 30, 30)',
    DEFAULT = 'rgb(230, 230, 230)',
};

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

    const setMenuNodeRef = useNodeControlsMenu(state => state.setNodeRef);
    const setNodeSize = useNodeControlsMenu(state => state.setNodeSize);
    const setMenuOrigin = useNodeControlsMenu(state => state.setNodeSetOrigin);
    const setMenuGoal = useNodeControlsMenu(state => state.setNodeSetTarget);
    const setNodeHighlightCallback = useNodeControlsMenu(state => state.setNodeSetHighlight);

    const [isHighlightedByMenu, setIsHighlightedByMenu] = useState(false);

    const setMenuOriginCallback = useCallback(() => setOrigin({ x, y }), [setOrigin, x, y]);
    const setMenuGoalCallback = useCallback(() => setGoal({ x, y }), [setGoal, x, y]);

    const updateMenu = useCallback(() => {
        setMenuNodeRef(nodeRef);
        setNodeSize(nodeSize);
        setMenuOrigin(setMenuOriginCallback);
        setMenuGoal(setMenuGoalCallback);
        setNodeHighlightCallback(setIsHighlightedByMenu);
        nodeRef.current?.moveToTop();
    }, [
        nodeSize,
        setMenuGoal,
        setMenuGoalCallback,
        setMenuNodeRef,
        setMenuOrigin,
        setMenuOriginCallback,
        setNodeHighlightCallback,
        setNodeSize
    ]);

    const fill = (() => {
        if (isHighlighted && !isOrigin && !isGoal && !isObstruction) return NodeColor.BACKTRACE_HIGHLIGHT;
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
            stroke={isHighlightedByMenu ? NodeColor.MENU_HIGHLIGHT_OUTLINE : NodeColor.OUTLINE}
            strokeWidth={isHighlightedByMenu ? 5 : 0.25}
            onClick={updateMenu}
            ref={nodeRef}
        />
    );
};

export default memo(Node);
