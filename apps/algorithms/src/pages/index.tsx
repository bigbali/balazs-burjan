import dynamic from 'next/dynamic';
import { startTransition, useCallback, useMemo, useState } from 'react';

enum Mode {
    PATHFINDER = 'pathfinder',
    SORT = 'sort'
}

const PathfinderVisualizer = dynamic(() => import('../pathfinder'), { ssr: false });

export default function Algorithms() {
    const [mode, setMode] = useState(() => Mode.PATHFINDER);

    const ALGORITHM_VISUALIZER_MAP = {
        [Mode.PATHFINDER]: PathfinderVisualizer,
        [Mode.SORT]: () => <h1>NOT IMPLEMENTED</h1>
    } as const;

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
            ModeSelector={<ModeSelector />}
            key={mode}
        />
    );
}
