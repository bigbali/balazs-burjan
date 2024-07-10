import type {
    MouseEventHandler,
    MouseEvent
} from 'react';
import type { Coordinate } from '../../type';
import {
    useEffect,
    useRef,
    useState } from 'react';
import NodeControls, { useNodeStore } from './NodeControls';
import useRenderer from '../hook/useRenderer';
import { useWindowResize } from 'ui-react19';

export type GridProps = {
    columns: number,
    rows: number,
};

let isMouseDown = false;
let isObstructionMode = true;

const Grid = ({ columns, rows }: GridProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);

    const { renderer, initialize } = useRenderer();

    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);

    const setNode = useNodeStore(state => state.setSelectedNode);

    const relativeCursorPosition = (e: MouseEvent) => ({
        x: e.clientX - renderer!.canvas.getBoundingClientRect().left,
        y: e.clientY - renderer!.canvas.getBoundingClientRect().top
    });

    const handleContextMenu: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const pos = relativeCursorPosition(e);
        setCursorPosition(pos);

        setNode(renderer?.getNodeAtCursor(pos.x, pos.y) ?? null);
    };

    const mouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const { x, y } = relativeCursorPosition(e);

        isMouseDown = true;
        isObstructionMode = !renderer?.getNodeAtCursor(x, y)?.isObstruction;
    };

    const mouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
        isMouseDown = false;
    };

    const mouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (isMouseDown) {
            const { x, y } = relativeCursorPosition(e);
            renderer?.getNodeAtCursor(x, y)?.setObstruction(isObstructionMode);
        }
    };

    useWindowResize(() => {
        requestAnimationFrame(() => renderer?.resize());

        // if the node menu is open while the window is resized, we hold a reference to a node that is no longer renderer,
        // thus we set it to null in order to prevent interacting with it
        setNode(null);
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
        <div className='relative w-full h-full overflow-auto'>
            <canvas
                ref={canvas}
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseMove={mouseMove}
                onContextMenu={handleContextMenu}>
            </canvas>
            <NodeControls position={cursorPosition} />
        </div>
    );
};

export default Grid;
