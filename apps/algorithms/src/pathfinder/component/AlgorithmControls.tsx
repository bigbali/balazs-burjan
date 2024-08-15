import { Button } from 'ui-react19';
import { State } from '../../type';
import usePathfinderStore from '../hook/usePathfinderStore';

type PathfinderControlsProps = {
    run: (state: State, resume?: boolean) => any
};

export default function PathfinderControls({ run }: PathfinderControlsProps) {
    const pState = usePathfinderStore(state => state.pathfinderState);
    const ogState = usePathfinderStore(state => state.obstructionGeneratorState);

    let button;
    let disabled = ogState === State.RUNNING;

    if (pState === State.RUNNING) {
        button = (
            <Button
                className='flex-1'
                onClick={() => void run(State.PAUSED)}
                disabled={disabled}
            >
                Pause
            </Button>
        );
    } else if (pState === State.PAUSED) {
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
