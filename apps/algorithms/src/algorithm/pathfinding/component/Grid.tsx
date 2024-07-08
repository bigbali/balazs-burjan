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
    const {
        rows,
        columns,
    } = data;

    const canvas = useRef<HTMLCanvasElement>(null);

    const renderer = useRenderer(canvas, { x: columns, y: rows }, data);

    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);

    const setNode = useNodeStore(state => state.setSelectedNode);

    const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const yOnCanvas = e.clientY - renderer!.canvas.getBoundingClientRect().top;
        const xOnCanvas = e.clientX - renderer!.canvas.getBoundingClientRect().left;

        setCursorPosition({ x: xOnCanvas, y: yOnCanvas });

        console.log(renderer!.getNodeAtCursor(xOnCanvas, yOnCanvas));

        const node = renderer!.getNodeAtCursor(xOnCanvas, yOnCanvas);

        setNode(node!);
    };

    useEffect(() => {
        renderer?.setResolution({ x: columns, y: rows });
    }, [columns, rows]);

    return (
        <div className='relative w-full h-full'>
            <canvas ref={canvas} onClick={handleClick}></canvas>
            <NodeControls position={cursorPosition} />
        </div>
    );
};

export default Grid;
