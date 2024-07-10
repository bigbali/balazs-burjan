import type { RunAction } from '../../type';
import { State } from '../../type';

type ObstructionGeneratorControlsProps = {
    state: State,
    run: RunAction
};

export default function ObstructionGeneratorControls({ state, run }: Readonly<ObstructionGeneratorControlsProps>) {
    if (state === State.OBSTRUCTION_GENERATOR) return (
        <button
            className='px-4 py-2 font-medium text-white rounded-lg bg-slate-700'
            onClick={() => void run(State.OBSTRUCTION_GENERATOR_PAUSED)}
        >
            Pause
        </button>
    );

    if (state === State.OBSTRUCTION_GENERATOR_PAUSED) return (
        <button
            className='px-4 py-2 font-medium text-white rounded-lg bg-slate-700'
            onClick={() => void run(State.OBSTRUCTION_GENERATOR)}
        >
            Continue
        </button>
    );

    return (
        <button
            className='px-4 py-2 font-medium text-white rounded-lg bg-slate-700 disabled:opacity-75 disabled:cursor-not-allowed'
            disabled
        >
            Pause
        </button>
    );
}
