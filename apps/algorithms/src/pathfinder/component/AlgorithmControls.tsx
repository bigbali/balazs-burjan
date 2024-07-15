import type { RunAction } from '../../type';
import { State } from '../../type';

type PathfinderControlsProps = {
    state: State,
    run: RunAction
};

export default function PathfinderControls({ state, run }: PathfinderControlsProps) {
    let button;
    let disabled = false;

    if (state === State.PATHFINDER_RUNNING || state === State.PATHFINDER_RESUMING) {
        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white bg-green-700 rounded-lg'
                onClick={() => void run(State.PATHFINDER_PAUSED)}
            >
                Pause
            </button>
        );
    } else if (state === State.PATHFINDER_PAUSED) {
        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white bg-green-700 rounded-lg'
                onClick={() => void run(State.PATHFINDER_RESUMING)}
            >
                Resume
            </button>
        );
    } else {
        if (state === State.OBSTRUCTION_GENERATOR_RESUMING || state === State.OBSTRUCTION_GENERATOR_RUNNING) {
            disabled = true;
        }

        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white bg-green-700 rounded-lg disabled:bg-slate-400'
                onClick={() => void run(State.PATHFINDER_RUNNING)}
                disabled={disabled}
            >
                Run
            </button>
        );
    }

    return (
        <div className='flex gap-[1rem] justify-stretch w-full'>
            {button}
            <button
                className='flex-1 px-4 py-2 font-medium text-white bg-red-700 rounded-lg disabled:bg-red-400'
                onClick={() => run(State.IDLE)}
                disabled={disabled}
            >
                Stop
            </button>
        </div>
    );
}
