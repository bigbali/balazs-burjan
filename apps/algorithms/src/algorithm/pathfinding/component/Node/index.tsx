import type { Dispatch, SetStateAction } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Rect } from 'react-konva';
import { useNodeControlsMenu } from '../NodeControls';
import { GRID_MARGIN } from '../Grid';
import { MouseButton, type Coordinate } from '../../../../util/type';
import type { Grid } from '../../type';
import { NodeColor } from '../../type';

export type NodeProps = {
    x: number,
    y: number,
    nodeSize: number,
    isOrigin: boolean,
    isGoal: boolean,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>,
    grid: Grid
};

function useForwardedState<T>(initialState: T) {
    const state = useState(initialState);
    return [state, state[0], state[1]] as const;
}

export default function Node({
    x,
    y,
    nodeSize,
    isOrigin,
    isGoal,
    setOrigin,
    setGoal,
    grid
}: NodeProps) {
    const [forwardVisited, isVisited, setIsVisited] = useForwardedState(false);
    const [forwardActive, isActive, setIsActive] = useForwardedState(false);
    const [forwardBacktrace, isBacktrace, setIsBacktrace] = useForwardedState(false);
    const [forwardObstruction, isObstruction, setIsObstruction] = useForwardedState(false);
    const [forwardWeight, weight, setWeight] = useForwardedState<number | null>(null);

    const node = grid[y]![x]!;
    node.visited = forwardVisited;
    node.active = forwardActive;
    node.backtrace = forwardBacktrace;
    node.obstruction = forwardObstruction;
    node.weight = forwardWeight;

    node.reset = () => {
        setIsVisited(false);
        setIsActive(false);
        setIsBacktrace(false);
        setIsObstruction(false);
        setWeight(null);
    };

    useEffect(() => {
        const node = grid[y]![x]!;
        node.visited = forwardVisited;
        node.active = forwardActive;
        node.backtrace = forwardBacktrace;
        node.obstruction = forwardObstruction;
        node.weight = forwardWeight;

        node.reset = () => {
            setIsVisited(false);
            setIsActive(false);
            setIsBacktrace(false);
            setIsObstruction(false);
            setWeight(null);
        };
    }, [
        forwardVisited,
        forwardActive,
        forwardObstruction,
        forwardWeight,
        forwardBacktrace,
        grid,
        y,
        x,
        setIsVisited,
        setIsActive,
        setIsObstruction,
        setWeight,
        setIsBacktrace
    ]);

    const nodeRef = useRef<Konva.Rect>(null);

    const setNodeRef = useNodeControlsMenu(state => state.setNodeRef);
    const setNodeSize = useNodeControlsMenu(state => state.setNodeSize);
    const setNodeIsOrigin = useNodeControlsMenu(state => state.setNodeIsOrigin);
    const setNodeIsTarget = useNodeControlsMenu(state => state.setNodeIsTarget);
    const setNodeIsObstruction = useNodeControlsMenu(state => state.setNodeIsObstruction);
    const setOriginSetter = useNodeControlsMenu(state => state.setNodeSetOrigin);
    const setTargetSetter = useNodeControlsMenu(state => state.setNodeSetTarget);
    const setObstructionSetter = useNodeControlsMenu(state => state.setNodeSetObstruction);
    const setNodeHighlightSetter = useNodeControlsMenu(state => state.setNodeSetHighlight);

    const [isHighlightedByMenu, setIsHighlightedByMenu] = useState(false);

    const setMenuOriginCallback = () => setOrigin({ x, y });
    const setMenuGoalCallback = () => setGoal({ x, y });

    const updateMenu = () => {
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

    const handleObstruction = useCallback((e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.buttons === MouseButton.LEFT)
            setIsObstruction(true);
        else if (e.evt.buttons === MouseButton.RIGHT)
            setIsObstruction(false);
    }, [setIsObstruction]);

    const fill = (() => {
        if (isBacktrace && !isOrigin && !isGoal && !isObstruction) return NodeColor.BACKTRACE;
        else if (isActive && !isOrigin && !isGoal && !isObstruction) return NodeColor.HIGHLIGHT_SELECTED;
        else if (isOrigin) return NodeColor.ORIGIN;
        else if (isGoal) return NodeColor.TARGET;
        else if (isVisited) return NodeColor.VISITED;
        else if (isObstruction) return NodeColor.OBSTRUCTION;

        if (weight !== null) {
            const r = 255 - weight;
            const g = Math.max((128 - weight) * 2, 30);
            const b = Math.max((128 - weight) * 2, 60);

            return `rgb(${r}, ${g}, ${b})`;
        }

        return NodeColor.DEFAULT;
    })();

    // const fill = NodeColor.DEFAULT;

    return (
        <Rect
            key={`${x}${y}`}
            ref={nodeRef}
            id={`${x}-${y}`}
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
            // The following 3 are performance optimizations.
            perfectDrawEnabled={false}
            transformsEnabled={'position'}
            listening={false}
            // NOTE: these won't be called directly as `listening=false`,
            // rather they will be fired from an event listener on `Grid`.
            onClick={updateMenu}
            onMouseDown={handleObstruction}
        />
    );
}
