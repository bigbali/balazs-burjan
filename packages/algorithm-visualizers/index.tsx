import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import PathfinderVisualizer from './algorithm/pathfinding';
import { useLoading } from './store/loading';
import 'config/tailwind/tailwind.css';

enum Mode {
    DRAW = 'draw',
    PATHFINDER = 'pathfinder',
    SORT = 'sort'
}

const ALGORITHM_VISUALIZER_MAP = {
    [Mode.PATHFINDER]: PathfinderVisualizer,
    [Mode.DRAW]: () => <h1>NOT IMPLEMENTED</h1>,
    [Mode.SORT]: () => <h1>NOT IMPLEMENTED</h1>
} as const;

const Algorithms = () => {
    const [mode, setMode] = useState(() => Mode.PATHFINDER);
    const [containedHeight, setContainedHeight] = useState(0);
    const isLoading = useLoading(state => state.isLoading);
    const visualizerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visualizerRef.current) {
            setContainedHeight(
                visualizerRef.current.offsetTop
            );
        }
    }, []);

    const Visualizer = useMemo(() => ALGORITHM_VISUALIZER_MAP[mode], [mode]);
    const ModeSelector = useMemo(() => (
        <div className='flex gap-4'>
            <label htmlFor='mode'>
                Mode
            </label>
            <select
                id='mode'
                className='border border-slate-3 rounded-md capitalize px-4'
                value={mode}
                onChange={(e) =>
                    startTransition(() =>
                        setMode(e.currentTarget.value as Mode)
                    )
                }
            >
                {Object.values(Mode).map((value) => (
                    <option
                        key={value}
                        value={value}
                        className='capitalize'
                    >
                        {value}
                    </option>
                )
                )}
            </select>
        </div>
    ), [mode]);


    return (
        <>
            {isLoading && (
                <div className='absolute inset-0 z-10 bg-pink-400 grid place-items-center'>
                    <h1 className='text-4xl text-center'>
                        {/* TODO */}
                        LOADING YO
                    </h1>
                </div>
            )}
            <Visualizer
                modeSelector={ModeSelector}
                key={mode}
                ref={visualizerRef}
                containedHeight={containedHeight}
            />
        </>
    );
};

export default Algorithms;
