import type { RunAction } from '../type';
import { State } from '../type';

type ObstructionGeneratorActionProps = {
    state: State,
    run: RunAction
};

export default function ObstructionGeneratorAction({ state, run }: Readonly<ObstructionGeneratorActionProps>) {
    if (state === State.OBSTRUCTION_GENERATOR) return (
        <button
            className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
            onClick={() => void run(State.OBSTRUCTION_GENERATOR_PAUSED)}
        >
            Pause
        </button>
    );

    if (state === State.OBSTRUCTION_GENERATOR_PAUSED) return (
        <button
            className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg'
            onClick={() => void run(State.OBSTRUCTION_GENERATOR)}
        >
            Continue
        </button>
    );

    return (
        <button
            className='bg-slate-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-75 disabled:cursor-not-allowed'
            disabled
        >
            Pause
        </button>
    );
}
