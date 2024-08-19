import type {
    MouseEventHandler,
    MouseEvent
} from 'react';
import { MouseButton, State, type Coordinate } from '../../type';
import {
    useEffect,
    useRef,
    useState } from 'react';
import NodeContextMenu, { useNodeControlsStore } from './NodeContextMenu';
import usePathfinderRenderer from '../hook/usePathfinderRenderer';
import { useWindowResize } from 'ui-react19';
import usePathfinderStore from '../hook/usePathfinderStore';
import useBacktraceHighlight from '../hook/useBacktraceHighlight';
import { PATHFINDER_MAP } from '../algorithm';

let isMouseDown = false;
let isObstructionMode = true;

const PathfinderCanvas = () => {
    const { renderer, initialize } = usePathfinderRenderer();
    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);
    const nodeContext = useNodeControlsStore();

    const { columns, rows, result } = usePathfinderStore();
    useBacktraceHighlight(result);

    const canvas = useRef<HTMLCanvasElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const relativeCursorPosition = (e: MouseEvent) => ({
        x: e.clientX - renderer!.canvas.getBoundingClientRect().left,
        y: e.clientY - renderer!.canvas.getBoundingClientRect().top
    });

    const handleContextMenu: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const pos = relativeCursorPosition(e);
        setCursorPosition(pos);

        nodeContext.toggle(renderer?.getNodeAtCursor(pos.x, pos.y)!);
    };

    const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (e.buttons !== MouseButton.LEFT) {
            return;
        }

        if (nodeContext.isOpen) {
            nodeContext.close();
        }

        const { x, y } = relativeCursorPosition(e);
        const node = renderer?.getNodeAtCursor(x, y);

        isMouseDown = true;
        isObstructionMode = !node?.isObstruction;
        node?.setObstruction(isObstructionMode);
    };

    const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
        isMouseDown = false;
    };

    const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (isMouseDown) {
            const { x, y } = relativeCursorPosition(e);
            renderer?.getNodeAtCursor(x, y)?.setObstruction(isObstructionMode);
        }
    };

    useWindowResize(() => {
        requestAnimationFrame(() => renderer?.resize(true));

        // if the node menu is open while the window is resized, we hold a reference to a node that is no longer rendered,
        // thus we set it to null in order to prevent interacting with it
        nodeContext.close();

        const store = usePathfinderStore.getState();

        store.setObstructionGeneratorState(State.IDLE);
        // usePathfinderStore.getState().setResult(null);
        // PATHFINDER_MAP[usePathfinderStore.getState().pathfinder].reset();

        if (store.pathfinderState === State.RUNNING) {
            PATHFINDER_MAP[store.pathfinder].reset();
        }
    });

    useEffect(() => {
        if (canvas.current) {
            initialize(canvas.current);
        }
    }, [initialize]);

    useEffect(() => {
        PATHFINDER_MAP[usePathfinderStore.getState().pathfinder].reset();

        renderer?.setResolution({ x: columns, y: rows });
    }, [columns, rows, renderer]);

    return (
        <div className='relative grid w-full h-full overflow-hidden place-items-center' ref={ref}>
            <canvas
                ref={canvas}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleContextMenu}>
            </canvas>
            <NodeContextMenu position={cursorPosition} container={ref.current} />
        </div>
    );
};

export default PathfinderCanvas;
