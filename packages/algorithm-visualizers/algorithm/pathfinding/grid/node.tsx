import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { memo, startTransition, useEffect, useRef, useState } from 'react';
import type { Coordinate } from '../../../util/common';
import { KonvaNodeComponent, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import type Konva from 'konva';
import { useNodeControlsMenu } from '../node-controls';

const enum NodeFill {
    ORIGIN = 'rgb(32, 200, 80)',
    TARGET = 'rgb(30, 128, 230)',
    HIGHLIGHTED = 'orange',
    VISITED = 'rgb(190, 210, 210)',
    OBSTRUCTION = 'rgb(30, 30, 30)'
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

    const setMenuNodeRef = useNodeControlsMenu(state => state.setNodeRef);
    const setNodeSize = useNodeControlsMenu(state => state.setNodeSize);
    const setMenuOrigin = useNodeControlsMenu(state => state.setOrigin);
    const setMenuGoal = useNodeControlsMenu(state => state.setGoal);

    const updateMenu = () => {
        setMenuNodeRef(nodeRef);
        setNodeSize(nodeSize);
        setMenuOrigin(() => setOrigin({ x, y }));
        setMenuGoal(() => setGoal({ x, y }));
    };

    resetRef.current = reset;

    const fill = (() => {
        if (isHighlighted && !isOrigin && !isGoal) return NodeFill.HIGHLIGHTED;
        if (isOrigin) return NodeFill.ORIGIN;
        if (isGoal) return NodeFill.TARGET;
        if (isVisited) return NodeFill.VISITED;
        if (isObstruction) return NodeFill.OBSTRUCTION;

        if (weight !== null) {
            const r = 255 - weight;
            const g = Math.max((128 - weight) * 2, 30);
            const b = Math.max((128 - weight) * 2, 60);

            return `rgb(${r}, ${g}, ${b})`;
        }

        // TODO darkmode ? dark grey : light grey
        return 'rgb(230, 230, 230)';
    })();

    return (
        <Rect
            x={nodeSize * x}
            y={nodeSize * y}
            width={nodeSize}
            height={nodeSize}
            fill={fill}
            shadowBlur={1}
            shadowColor='rgb(127, 127, 127)'
            onClick={updateMenu}
            ref={nodeRef}
        />
    );
};

export default memo(Node);
