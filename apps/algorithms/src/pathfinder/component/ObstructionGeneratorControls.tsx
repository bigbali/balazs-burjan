import Button from 'ui-react19/Button';
import { State } from '../../type';
import usePathfinderStore from '../hook/usePathfinderStore';

type ObstructionGeneratorControlsProps = {
    run: (state: State, resume?: boolean) => any
};

export default function ObstructionGeneratorControls({ run }: ObstructionGeneratorControlsProps) {
    const ogState = usePathfinderStore(state => state.obstructionGeneratorState);
    const pState = usePathfinderStore(state => state.pathfinderState);

    let button;
    let disabled = pState === State.RUNNING;

    if (ogState === State.RUNNING) {
        button = (
            <Button
                className='flex-1'
                onClick={() => void run(State.PAUSED)}
                disabled={disabled}
            >
                Pause
            </Button>
        );
    } else if (ogState === State.PAUSED) {
        button = (
            <Button
                className='flex-1'
                onClick={() => void run(State.RUNNING, true)}
                disabled={disabled}
            >
                Resume
            </Button>
        );
    } else {
        button = (
            <Button
                className='flex-1'
                onClick={() => void run(State.RUNNING)}
                disabled={disabled}
            >
                Run
            </Button>
        );
    }

    return (
        <div className='flex gap-[1rem] justify-stretch w-full'>
            {button}
            <Button
                className='flex-1'
                onClick={() => run(State.IDLE)}
                disabled={disabled}
                variant='destructive'
            >
                Stop
            </Button>
        </div>
    );
}
