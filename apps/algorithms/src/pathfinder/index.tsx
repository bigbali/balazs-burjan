import {
    useState,
    useEffect,
    useRef
} from 'react';
import type {  Entry } from '../type';
import { Delay, Dimensions, State } from '../type';
import Menu from './component/Menu';
import useBacktraceHighlight from './hook/useBacktraceHighlight';
import Grid from './component/Grid';
import type React from 'react';

export type PathfinderVisualizerProps = {
    ModeSelector: React.JSX.Element,
};

export default function PathfinderVisualizer({ ModeSelector }: PathfinderVisualizerProps) {
    const [rows, setRows] = useState(Dimensions.DEFAULT);
    const [columns, setColumns] = useState(Dimensions.DEFAULT);

    const [state, setState] = useState(State.IDLE);
    const [result, setResult] = useState<Entry>(null);

    const delayRef = useRef(Delay.DEFAULT);
    const stateRef = useRef(state);

    const setPathfinderState = (state: State) => {
        stateRef.current = state;
        setState(state);
    };

    useEffect(() => { stateRef.current = state; }, [state]);

    useBacktraceHighlight(result);

    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <Grid columns={columns} rows={rows} />
            <Menu
                ModeSelector={ModeSelector}
                rows={rows}
                columns={columns}
                state={state}
                result={result}
                delayRef={delayRef}
                stateRef={stateRef}
                setRows={setRows}
                setColumns={setColumns}
                setPathfinderState={setPathfinderState}
                setResult={setResult}
            />
        </div>
    );
}
