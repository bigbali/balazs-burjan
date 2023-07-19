import {
    useCallback,
    useTransition,
    useMemo,
    useState,
    forwardRef,
    useEffect,
    useRef,
    FC
} from 'react';
import dynamic from 'next/dynamic';
import { useLoading } from 'ui/store/loading';
import useBacktraceHighlight from './component/node/useBacktraceHighlight';
import type { Coordinate, Entry } from '../../util/type';
import type { Node, Grid as GridType } from './type';
import { Delay, Dimensions, PathfinderState } from './type';
import SettingsMenu from './component/Menu';

const Grid = dynamic(() => import('./component/grid'), {
    ssr: false
});

type PathfinderVisualizerProps = {
    ModeSelector: React.FC,
    containedHeight?: number
};

// TODO major refactor
export default forwardRef<HTMLDivElement, PathfinderVisualizerProps>(
    function PathfinderVisualizer({ ModeSelector, containedHeight }, ref) {
        const [rows, setRows] = useState(Dimensions.DEFAULT);
        const [columns, setColumns] = useState(Dimensions.DEFAULT);

        const [state, setState] = useState(PathfinderState.STOPPED);
        const [result, setResult] = useState<Entry>(null);

        const [origin, setOrigin] = useState<Coordinate>({ x: 0, y: 0 });
        const [target, setTarget] = useState<Coordinate>({ x: columns - 1, y: rows - 1 });

        const delayRef = useRef(Delay.DEFAULT);
        const stateRef = useRef(state);

        const [isPending, startTransition] = useTransition();
        const setRowsTransition = useCallback((value: number) => startTransition(() => setRows(value)), []);
        const setColumnsTransition = useCallback((value: number) => startTransition(() => setColumns(value)), []);

        const setPathfinderState = useCallback((state: PathfinderState) => {
            stateRef.current = state;
            setState(state);
        }, []);

        const setGlobalLoading = useLoading(state => state.setIsLoading);
        useEffect(() => setGlobalLoading(isPending), [isPending, setGlobalLoading]);
        useEffect(() => { stateRef.current = state; }, [state]);

        const grid = useMemo(() => {
            const refs = new Array<Node[]>(rows);
            for (let y = 0; y < rows; y++) {
                const row = new Array<Node>(columns);

                for (let x = 0; x < columns; x++) {
                    row[x] = {
                        visited: [false, () => { }],
                        active: [false, () => { }],
                        backtrace: [false, () => { }],
                        obstruction: [false, () => { }],
                        weight: [null, () => { }],
                        reset: () => { }
                    };
                }

                refs[y] = row;
            }

            return refs;
        }, [columns, rows]) as GridType;

        useBacktraceHighlight(grid, result);

        const gridData = useMemo(() => ({
            columns, rows, grid, origin, target, setOrigin, setGoal: setTarget
        }), [columns, target, grid, origin, rows]);

        const settingsMenuData = useMemo(() => ({
            ModeSelector,
            columns,
            rows,
            grid,
            origin,
            target,
            state,
            result,
            stateRef,
            delayRef,
            setRowsTransition,
            setColumnsTransition,
            setPathfinderState,
            setResult
        }), [
            ModeSelector,
            rows,
            columns,
            grid,
            origin,
            target,
            state,
            result,
            delayRef,
            stateRef,
            setRowsTransition,
            setColumnsTransition,
            setPathfinderState,
            setResult
        ]);

        return ( // strange stuff, but this needs translate(0) so the contained fixed element is not relative to viewport
            <div
                style={{
                    height: `calc(100vh - ${containedHeight ?? 0}px)`
                }}
                className='relative max-w-full p-2 translate-x-0 overflow-hidden'
                ref={ref}
            >
                <Grid data={gridData} />
                <SettingsMenu data={settingsMenuData} />
            </div>
        );
    });
