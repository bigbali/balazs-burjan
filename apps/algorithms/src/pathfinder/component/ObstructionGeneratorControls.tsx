import { State } from '../../type';
import usePathfinderStore from '../hook/usePathfinderStore';

type ObstructionGeneratorControlsProps = {
    run: (state: State, resume?: boolean) => any
};

const c = 'flex-1 px-4 py-2 font-medium text-white rounded-lg bg-cyan-700 disabled:bg-slate-400';

export default function ObstructionGeneratorControls({ run }: ObstructionGeneratorControlsProps) {
    const ogState = usePathfinderStore(state => state.obstructionGeneratorState);
    const pState = usePathfinderStore(state => state.pathfinderState);

    let button;
    let disabled = pState === State.RUNNING;

    if (ogState === State.RUNNING) {
        button = (
            <button
                className={c}
                onClick={() => void run(State.PAUSED)}
                disabled={disabled}
            >
                Pause
            </button>
        );
    } else if (ogState === State.PAUSED) {
        button = (
            <button
                className={c}
                onClick={() => void run(State.RUNNING, true)}
                disabled={disabled}
            >
                Resume
            </button>
        );
    } else {
        button = (
            <button
                className={c}
                onClick={() => void run(State.RUNNING)}
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
