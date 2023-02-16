import { PathfindingAlgorithmsState } from '../state';

type StateButtonProps = {
    state: PathfindingAlgorithmsState,
    onClick: () => void
};

const START_BUTTON_CONTENT_MAP = {
    [PathfindingAlgorithmsState.STOPPED]: 'Start',
    [PathfindingAlgorithmsState.RUNNING]: 'Pause',
    [PathfindingAlgorithmsState.PAUSED]: 'Continue'
} as const;

const START_BUTTON_CLASS_MAP = {
    [PathfindingAlgorithmsState.STOPPED]: 'bg-sky-700',
    [PathfindingAlgorithmsState.RUNNING]: 'bg-orange-500',
    [PathfindingAlgorithmsState.PAUSED]: 'bg-green-500'
} as const;

export const StateButton = ({ state, onClick }: StateButtonProps) => {
    return (
        <button
            className={`${START_BUTTON_CLASS_MAP[state]} text-white font-medium px-4 py-2 rounded-lg`}
            onClick={onClick}
        >
            {START_BUTTON_CONTENT_MAP[state]}
        </button>
    );
};
