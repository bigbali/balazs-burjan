import { startTransition, useState } from 'react';
import PathfindingAlgorithms from './algorithm/pathfinding';
import { useLoading } from './store/loading';
import 'config/tailwind/tailwind.css';

enum Mode {
    DRAW = 'draw',
    PATHFINDER = 'pathfinder',
    SORT = 'sort'
}

const ALGORITHM_VISUALIZER_MAP = {
    [Mode.PATHFINDER]: <PathfindingAlgorithms />,
    [Mode.DRAW]: <h1>NOT IMPLEMENTED</h1>,
    [Mode.SORT]: <h1>NOT IMPLEMENTED</h1>
};

const Algorithms = () => {
    const [mode, setMode] = useState(() => Mode.PATHFINDER);
    const isLoading = useLoading(state => state.isLoading);

    return (
        <>
            {isLoading && (
                <div className='absolute inset-0 z-10 bg-pink-400 grid place-items-center'>
                    <h1 className='text-4xl text-center'>
                        LOADING YO
                    </h1>
                </div>
            )}
            <div className='pl-24 pr-24 pt-12 pb-12'>
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
                        {Object.values(Mode).map((value) => {
                            return (
                                <option
                                    key={value}
                                    value={value}
                                    className='capitalize'
                                >
                                    {value}
                                </option>
                            );
                        })}
                    </select>
                </div>
                {ALGORITHM_VISUALIZER_MAP[mode]}
            </div>
        </>
    );
};

export default Algorithms;
