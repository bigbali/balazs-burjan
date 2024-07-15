import type { RunAction } from '../../type';
import { State } from '../../type';

type ObstructionGeneratorControlsProps = {
    state: State,
    run: RunAction
};

export default function ObstructionGeneratorControls({ state, run }: ObstructionGeneratorControlsProps) {
    let button;
    let disabled = false;

    if (state === State.OBSTRUCTION_GENERATOR_RUNNING || state === State.OBSTRUCTION_GENERATOR_RESUMING) {
        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white rounded-lg bg-cyan-700'
                onClick={() => void run(State.OBSTRUCTION_GENERATOR_PAUSED)}
            >
                Pause
            </button>
        );
    } else if (state === State.OBSTRUCTION_GENERATOR_PAUSED) {
        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white rounded-lg bg-cyan-700'
                onClick={() => void run(State.OBSTRUCTION_GENERATOR_RESUMING)}
            >
                Resume
            </button>
        );
    } else {
        if (state === State.PATHFINDER_RESUMING || state === State.PATHFINDER_RUNNING) {
            disabled = true;
        }

        button = (
            <button
                className='flex-1 px-4 py-2 font-medium text-white rounded-lg bg-cyan-700 disabled:bg-slate-400'
                onClick={() => void run(State.OBSTRUCTION_GENERATOR_RUNNING)}
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
