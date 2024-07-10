import type { RunAction } from '../../type';
import { State } from '../../type';

type AlgorithmControlsProps = {
    state: State,
    run: RunAction
};

const START_BUTTON_CONTENT_MAP = {
    [State.IDLE]: 'Start',
    [State.PATHFINDER]: 'Pause',
    [State.PATHFINDER_CONTINUE]: 'Pause',
    [State.PATHFINDER_PAUSED]: 'Continue'
} as const;

const START_BUTTON_CLASS_MAP = {
    [State.IDLE]: 'bg-sky-700',
    [State.PATHFINDER]: 'bg-orange-500',
    [State.PATHFINDER_CONTINUE]: 'bg-orange-500',
    [State.PATHFINDER_PAUSED]: 'bg-green-500'
} as const;

export default function AlgorithmControls({ state, run }: Readonly<AlgorithmControlsProps>) {
    const className = START_BUTTON_CLASS_MAP[state as keyof typeof START_BUTTON_CONTENT_MAP] ?? 'bg-yellow-500';
    const content = START_BUTTON_CONTENT_MAP[state as keyof typeof START_BUTTON_CONTENT_MAP] ?? 'hello';

    const onClick = (() => {
        if (state === State.IDLE) return () => run(State.PATHFINDER);
        if (state === State.PATHFINDER || state === State.PATHFINDER_CONTINUE) return () => run(State.PATHFINDER_PAUSED);
        if (state === State.PATHFINDER_PAUSED) return () => run(State.PATHFINDER_CONTINUE);
    })();

    const disabled = (() => {
        return !state.startsWith(State.PATHFINDER) && state !== State.IDLE;
    })();

    return (
        <button
            className={`
                ${className}
                text-white font-medium px-4 py-2 rounded-lg disabled:opacity-75 disabled:cursor-not-allowed
            `}
            disabled={disabled}
            onClick={onClick}
        >
            {content}
        </button>
    );
}
