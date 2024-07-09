import type {
    SetStateAction,
    Dispatch,
    MouseEventHandler
} from 'react';
import {
    useEffect,
    useRef,
    useState } from 'react';
import type { Grid as GridType } from '../type';
import NodeControls, { useNodeStore } from './NodeControls';
import { type Coordinate } from '../../../util/type';
import useRenderer from '../hook/useRenderer';
import { useWindowResize } from 'ui-react19';

export type GridData = {
    columns: number,
    rows: number,
    grid: GridType,
    origin: Coordinate,
    target: Coordinate,
    setOrigin: Dispatch<SetStateAction<Coordinate>>,
    setGoal: Dispatch<SetStateAction<Coordinate>>
};

export type GridProps = {
    data: GridData
};


const Grid = ({ data }: GridProps) => {
    const { rows, columns } = data;

    const canvas = useRef<HTMLCanvasElement>(null);

    const renderer = useRenderer(canvas, { x: columns, y: rows }, data);

    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);

    const setNode = useNodeStore(state => state.setSelectedNode);

    // should handle drag also
    const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const yOnCanvas = e.clientY - renderer!.canvas.getBoundingClientRect().top;
        const xOnCanvas = e.clientX - renderer!.canvas.getBoundingClientRect().left;

        // on right click, open menu
        // on left, draw obstruction

        console.log('clickclkicl');

        setCursorPosition({ x: xOnCanvas, y: yOnCanvas });
        const node = renderer!.getNodeAtCursor(xOnCanvas, yOnCanvas);

        setNode(node);
    };

    const handleContextMenu: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const yOnCanvas = e.clientY - renderer!.canvas.getBoundingClientRect().top;
        const xOnCanvas = e.clientX - renderer!.canvas.getBoundingClientRect().left;

        setCursorPosition({ x: xOnCanvas, y: yOnCanvas });
        const node = renderer!.getNodeAtCursor(xOnCanvas, yOnCanvas);

        setNode(node);
    };

    useWindowResize(() => {
        requestAnimationFrame(() => renderer?.resize());

        // if the node menu is open while the window is resized, we hold a reference to a node that is no longer renderer,
        // thus we set it to null in order to prevent interacting with it
        setNode(null);
    });

    useEffect(() => {
        renderer?.setResolution({ x: columns, y: rows });
    }, [columns, rows]);

    return (
        <div className='relative w-full h-full overflow-auto'>
            <canvas ref={canvas} onClick={handleClick} onContextMenu={handleContextMenu}></canvas>
            <NodeControls position={cursorPosition} />
        </div>
    );
};

export default Grid;
