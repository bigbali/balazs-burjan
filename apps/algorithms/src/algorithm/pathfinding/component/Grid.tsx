import type {
    SetStateAction,
    Dispatch,
    MouseEventHandler
} from 'react';
import {
    useCallback,
    useEffect,
    useRef,
    useState } from 'react';
import type { Grid as GridType } from '../type';
import NodeControls, {  useNodeControlsMenu, useNodeStore } from './NodeControls';
import { MouseButton, type Coordinate } from '../../../util/type';
import useRenderer from '../hook/useRenderer';
import { KonvaEventObject } from 'konva/lib/Node';
import type Canvas from '../../../renderer/canvas';

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

export let abc: Canvas;

/** When `mouseup` event triggers, we need to cancel it if
 *  when we were actually holding the button to paint */
let cancelClick = false;


const Grid = ({ data }: GridProps) => {
    const {
        rows,
        columns,
        ...gridData
    } = data;

    const canvas = useRef<HTMLCanvasElement>(null);

    const gridRef = useRef<HTMLDivElement>(null);
    // const [gridDimensions, setGridDimensions] = useState(DEFAULT_GRID_SIZE);
    const renderer = useRenderer(canvas, { x: columns, y: rows }, data);

    useEffect(() => {abc = renderer!;}, [renderer]);

    const setGrid = useNodeControlsMenu(state => state.setGrid);

    useEffect(() => {
        setGrid(gridRef.current);
    }, [setGrid]);

    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);

    const setNode = useNodeStore(state => state.setSelectedNode);

    // const nodeSize = Math.min(
    //     (columns - GRID_MARGIN * 2) / columns,
    //     (rows - GRID_MARGIN * 2) / rows
    // );

    // const nodeAtPosition = useCallback((x: number, y: number) => {
    //     return {
    //         x: Math.min(Math.floor((x / nodeSize)), columns - 1),
    //         y: Math.min(Math.floor((y / nodeSize)), rows - 1)
    //     };
    // }, [columns, rows, nodeSize]);

    // const getNode = useCallback((e: KonvaEventObject<MouseEvent>) => {
    //     const n = renderer?.getNode(e.evt.offsetX, e.evt.offsetY);
    //     // return layerRef.current?.findOne(`#${n.x}-${n.y}`);
    // }, [renderer]);

    // // const fireNodeClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    // //     console.log('click');
    // //     if (cancelClick) {
    // //         cancelClick = false;
    // //         return;
    // //     }
    // //     getNode(e)?._fire('click', null);
    // // }, [getNode]);

    // const fireNodeMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    //     if (e.evt.buttons === MouseButton.NONE) return;
    //     cancelClick = true;
    //     getNode(e)?._fire('mousedown', e);
    // }, [getNode]);

    // const preventContextMenu = useCallback((e: KonvaEventObject<MouseEvent>) => {
    //     e.evt.preventDefault();
    // }, []);

    const handleClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
        const yOnCanvas = e.clientY - renderer!.canvas.getBoundingClientRect().top;
        const xOnCanvas = e.clientX - renderer!.canvas.getBoundingClientRect().left;
        //  e.relatedTa

        setPos({ x: xOnCanvas, y: yOnCanvas });
        setOpen(open => !open);

        // console.log(yOnCanvas);

        const node = renderer!.getNodeAtCursor(xOnCanvas, yOnCanvas);

        node?.paint('pink');
        setNode(node!);
    };

    useEffect(() => {
        renderer?.setResolution({ x: columns, y: rows });
        renderer?.updateNodeSize();

        // renderer?.setTarget(renderer.getNodeAtIndex(gridData.target.x, gridData.target.y));
        renderer?.update();
    }, [columns, rows, gridData.target]);

    return (
        <div className='relative w-full h-full' ref={gridRef}>
            <canvas ref={canvas} onClick={handleClick}></canvas>
            <NodeControls open={open} position={pos} />
        </div>
    );
};

export default Grid;
