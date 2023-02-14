import { startTransition } from 'react';
import React, { useState } from 'react';
import PathfindingAlgorithms from './pathfinding';

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
    return (
        <div className='pl-24 pr-24 pt-12 pb-12'>
            <h1 className='text-center text-2xl'>
                Algorithms
            </h1>
            <div className='flex gap-4'>
                <label htmlFor='mode'>
                    Mode
                </label>
                <select
                    id='mode'
                    className='border border-black capitalize'
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
    );
};

export default Algorithms;
