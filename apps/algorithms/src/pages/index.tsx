import dynamic from 'next/dynamic';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
const PathfinderVisualizer = dynamic(() => import('../algorithm/pathfinding'), {ssr: false});
// import { useLoading } from 'ui-react19/store/loading';

enum Mode {
    PATHFINDER = 'pathfinder',
    SORT = 'sort'
}

const ALGORITHM_VISUALIZER_MAP = {
    [Mode.PATHFINDER]: PathfinderVisualizer,
    [Mode.SORT]: () => <h1>NOT IMPLEMENTED</h1>
} as const;

const Algorithms = () => {
    const [mode, setMode] = useState(() => Mode.PATHFINDER);
    const [topOffset, setTopOffset] = useState(0);
    const visualizerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visualizerRef.current) {
            setTopOffset(
                visualizerRef.current.offsetTop
            );
        }
    }, []);

    const Visualizer = useMemo(() => ALGORITHM_VISUALIZER_MAP[mode], [mode]);
    const ModeSelector = useCallback(() => (
        <div className='flex gap-4'>
            <label htmlFor='mode'>
                Mode
            </label>
            <select
                id='mode'
                className='px-4 capitalize border rounded-md border-slate-3'
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
        <Visualizer
            ModeSelector={ModeSelector}
            key={mode}
            ref={visualizerRef}
            topOffset={topOffset}
        />
    );
};

export default Algorithms;
