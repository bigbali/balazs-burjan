import type {
    MouseEventHandler,
    MouseEvent
} from 'react';
import { MouseButton, type Coordinate } from '../../type';
import {
    useEffect,
    useRef,
    useState } from 'react';
import NodeControls, { useNodeControlsStore } from './NodeControls';
import useRenderer from '../hook/useRenderer';
import { useWindowResize } from 'ui-react19';

export type GridProps = {
    columns: number,
    rows: number,
};

let isMouseDown = false;
let isObstructionMode = true;

const Grid = ({ columns, rows }: GridProps) => {
    const { renderer, initialize } = useRenderer();
    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);
    const nodeContext = useNodeControlsStore();

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
        requestAnimationFrame(() => renderer?.resize());

        // if the node menu is open while the window is resized, we hold a reference to a node that is no longer renderer,
        // thus we set it to null in order to prevent interacting with it
        nodeContext.close();
    });

    useEffect(() => {
        if (canvas.current) {
            initialize(canvas.current);
        }
    }, [canvas.current]);

    useEffect(() => {
        renderer?.setResolution({ x: columns, y: rows });
    }, [columns, rows]);

    return (
        <div className='relative w-full h-full overflow-hidden' ref={ref}>
            <canvas
                ref={canvas}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleContextMenu}>
            </canvas>
            <NodeControls position={cursorPosition} container={ref.current} />
        </div>
    );
};

export default Grid;
