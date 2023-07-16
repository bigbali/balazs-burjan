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
    memo,
    useMemo,
    useCallback
} from 'react';
import { Layer, Stage } from 'react-konva';
import type { Grid as Nodes } from '../type';
import NodeControls, { useNodeControlsMenu } from './node-controls';
import { MouseButton, type Coordinate } from '../../../util/type';
import { Row } from './row';

export const GRID_MARGIN = 3;

export type GridData = {
    columns: number,
    rows: number,
    nodes: Nodes,
    origin: Coordinate,
    goal: Coordinate,
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
        ...gridData
    } = data;

    const layerRef = useRef<Konva.Layer>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridDimensions, setGridDimensions] = useState({
        x: 0,
        y: 0
    });

    const setGrid = useNodeControlsMenu(state => state.setGrid);

    useEffect(() => {
        setGrid(gridRef.current);
    }, [setGrid]);

    const nodeSize = Math.min(
        (gridDimensions.x - GRID_MARGIN * 2) / columns,
        (gridDimensions.y - GRID_MARGIN * 2) / rows
    );

    const rowElements = useMemo(() => {
        const rowArray = new Array<JSX.Element>(rows);

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
        getNode(e)?._fire('click', null);
    }, [getNode]);

    const fireNodeMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.buttons === MouseButton.NONE) return;
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
        <div className='mr-8 h-full' ref={gridRef}>
            <NodeControls />
            <Stage
                className='mx-auto max-h-full max-w-full'
                width={nodeSize * columns + GRID_MARGIN * 2}
                height={nodeSize * rows + GRID_MARGIN * 2}
                onMouseMove={fireNodeMouseDown}
                onClick={fireNodeClick}
                onContextMenu={preventContextMenu}
            >
                <Layer ref={layerRef}>
                    {!!gridDimensions.x && rowElements}
                </Layer>
            </Stage>
        </div>
    );
};

export default memo(Grid);
