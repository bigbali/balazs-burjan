import { State } from '../../type';
import usePathfinderStore from '../hook/usePathfinderStore';

type PathfinderControlsProps = {
    run: (state: State, resume?: boolean) => any
};

const c = 'flex-1 px-4 py-2 font-medium text-white rounded-lg bg-green-700 disabled:bg-slate-400';

export default function PathfinderControls({ run }: PathfinderControlsProps) {
    const pState = usePathfinderStore(state => state.pathfinderState);
    const ogState = usePathfinderStore(state => state.obstructionGeneratorState);

    let button;
    let disabled = ogState === State.RUNNING;

    if (pState === State.RUNNING) {
        button = (
            <button
                className={c}
                onClick={() => void run(State.PAUSED)}
                disabled={disabled}
            >
                Pause
            </button>
        );
    } else if (pState === State.PAUSED) {
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
