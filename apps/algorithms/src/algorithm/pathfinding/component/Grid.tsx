import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type {
    SetStateAction,
    Dispatch
} from 'react';
import {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback
} from 'react';
import { Layer, Stage } from 'react-konva';
import type { Grid as GridType } from '../type';
import NodeControls, { useNodeControlsMenu } from './NodeControls';
import { MouseButton, type Coordinate } from '../../../util/type';
import Row from './Row';
import Canvas from '../../../renderer/canvas';
import useRenderer from '../hook/useRenderer';

export const GRID_MARGIN = 3;

const DEFAULT_GRID_SIZE = {
    x: 20,
    y: 20
};

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


    const layerRef = useRef<Konva.Layer>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridDimensions, setGridDimensions] = useState(DEFAULT_GRID_SIZE);
    const renderer = useRenderer(canvas, gridDimensions);

    const setGrid = useNodeControlsMenu(state => state.setGrid);

    useEffect(() => {
        setGrid(gridRef.current);
    }, [setGrid]);

    const nodeSize = Math.min(
        (gridDimensions.x - GRID_MARGIN * 2) / columns,
        (gridDimensions.y - GRID_MARGIN * 2) / rows
    );

    const rowElements = useMemo(() => {
        const rowArray = new Array<React.JSX.Element>(rows);

        for (let row = 0; row < rows; row++) {
            rowArray[row] = (
                <Row
                    key={row}
                    data={{
                        nodeSize,
                        row,
                        columns,
                        ...gridData
                    }}
                />
            );
        }
        return rowArray;
    }, [columns, gridData, nodeSize, rows]);

    const nodeAtPosition = useCallback((x: number, y: number) => {
        return {
            x: Math.min(Math.floor((x / nodeSize)), columns - 1),
            y: Math.min(Math.floor((y / nodeSize)), rows - 1)
        };
    }, [columns, rows, nodeSize]);

    const getNode = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const n = nodeAtPosition(e.evt.offsetX, e.evt.offsetY);
        return layerRef.current?.findOne(`#${n.x}-${n.y}`);
    }, [nodeAtPosition]);

    const fireNodeClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        console.log('click');
        if (cancelClick) {
            cancelClick = false;
            return;
        }
        getNode(e)?._fire('click', null);
    }, [getNode]);

    const fireNodeMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.buttons === MouseButton.NONE) return;
        cancelClick = true;
        getNode(e)?._fire('mousedown', e);
    }, [getNode]);

    const preventContextMenu = useCallback((e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
    }, []);

    useEffect(() => {
        if (!gridRef.current) return;

        setGridDimensions({
            x: gridRef.current.scrollWidth,
            y: gridRef.current.scrollHeight
        });
    }, [rows, columns]);



    return (
        <div className='w-full h-full' ref={gridRef}>
            {/* <NodeControls />
            <Stage
                className='max-w-full max-h-full mx-auto'
                width={nodeSize * columns + GRID_MARGIN * 2}
                height={nodeSize * rows + GRID_MARGIN * 2}
                onMouseMove={fireNodeMouseDown}
                onClick={fireNodeClick}
                onContextMenu={preventContextMenu}
            >
                <Layer ref={layerRef}>
                    {!!gridDimensions.x && rowElements}
                </Layer>
            </Stage> */}
            <canvas ref={canvas}></canvas>
        </div>
    );
};

export default Grid;
