import {
    useCallback,
    useTransition,
    useMemo,
    useState,
    forwardRef,
    useEffect,
    useRef
} from 'react';
import dynamic from 'next/dynamic';
import type { Coordinate, Entry } from '../../util/type';
import { Delay, Dimensions, State } from './type';
import Menu from './component/Menu';
import useGrid from './hook/useGrid';
import { useLoading } from '../../store/useLoading';
import useBacktraceHighlight from './component/Node/useBacktraceHighlight';
import Grid from './component/Grid';


type PathfinderVisualizerProps = {
    ModeSelector: React.FC,
    topOffset?: number
};

export default forwardRef<HTMLDivElement, PathfinderVisualizerProps>(
    function PathfinderVisualizer({ ModeSelector, topOffset }, ref) {
        const [rows, setRows] = useState(Dimensions.DEFAULT);
        const [columns, setColumns] = useState(Dimensions.DEFAULT);

        const [state, setState] = useState(State.IDLE);
        const [result, setResult] = useState<Entry>(null);

        const [origin, setOrigin] = useState<Coordinate>({ x: 0, y: 0 });
        const [target, setTarget] = useState<Coordinate>({ x: columns - 1, y: rows - 1 });

        const delayRef = useRef(Delay.DEFAULT);
        const stateRef = useRef(state);

        const [isPending, startTransition] = useTransition();
        const setRowsTransition = useCallback((value: number) => startTransition(() => setRows(value)), []);
        const setColumnsTransition = useCallback((value: number) => startTransition(() => setColumns(value)), []);

        const setPathfinderState = useCallback((state: State) => {
            stateRef.current = state;
            setState(state);
        }, []);

        const setGlobalLoading = useLoading(state => state.setIsLoading);
        useEffect(() => setGlobalLoading(isPending), [isPending, setGlobalLoading]);
        useEffect(() => { stateRef.current = state; }, [state]);

        const grid = useGrid(columns, rows);
        useBacktraceHighlight(grid, result);

        console.log(result);

        const gridData = useMemo(() => ({
            columns, rows, grid, origin, target, setOrigin, setGoal: setTarget
        }), [columns, target, grid, origin, rows]);

        // useEffect(() => {
        //     // if the grid got smaller, check if the target is out of bounds and bring it in if so
        //     setTarget(state => (state.x >= columns || state.y >= rows)
        //         ? { x: columns - 1, y: rows - 1 }
        //         : state
        //     );
        // }, [columns, rows]);

        return (
            <div
                style={{
                    height: `calc(100vh - ${topOffset ?? 0}px)`
                }}
                // NOTE is this still relevant?
                // this needs translate(0) so the contained fixed element is not relative to viewport
                className='relative w-full p-2 overflow-hidden translate-x-0 flex gap-[1rem] justify-between'
                ref={ref}
            >
                <Grid data={gridData} />
                <Menu
                    ModeSelector={ModeSelector}
                    rows={rows}
                    columns={columns}
                    grid={grid}
                    origin={origin}
                    target={target}
                    state={state}
                    result={result}
                    delayRef={delayRef}
                    stateRef={stateRef}
                    setRowsTransition={setRowsTransition}
                    setColumnsTransition={setColumnsTransition}
                    setPathfinderState={setPathfinderState}
                    setResult={setResult}
                    setState={setPathfinderState}
                />
            </div>
        );
    });
