import { PathfinderState } from '../../type';

type StateButtonProps = {
    state: PathfinderState,
    disable?: boolean,
    onClick: () => void
};

const START_BUTTON_CONTENT_MAP = {
    [PathfinderState.STOPPED]: 'Start',
    [PathfinderState.RUNNING]: 'Pause',
    [PathfinderState.PAUSED]: 'Continue'
} as const;

const START_BUTTON_CLASS_MAP = {
    [PathfinderState.STOPPED]: 'bg-sky-700',
    [PathfinderState.RUNNING]: 'bg-orange-500',
    [PathfinderState.PAUSED]: 'bg-green-500'
} as const;

export const StateButton = ({ state, disable, onClick }: StateButtonProps) => {
    return (
        <button
            className={`
                ${START_BUTTON_CLASS_MAP[state]}
                text-white font-medium px-4 py-2 rounded-lg disabled:opacity-75 disabled:cursor-not-allowed
             `}
            disabled={disable}
            onClick={onClick}
        >
            {START_BUTTON_CONTENT_MAP[state]}
        </button>
    );
};
