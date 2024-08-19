import { State } from '../../type';
import useSorterStore from '../hook/useSorterStore';
import { Button } from 'ui-react19';

type PathfinderControlsProps = {
    run: (state: State, resume?: boolean) => any
};

const c = 'flex-1 font-medium';

export default function SorterControls({ run }: PathfinderControlsProps) {
    const state = useSorterStore(state => state.state);

    let button;

    if (state === State.RUNNING) {
        button = (
            <Button
                className={c}
                onClick={() => void run(State.PAUSED)}
            >
                Pause
            </Button>
        );
    } else if (state === State.PAUSED) {
        button = (
            <Button
                className={c}
                onClick={() => void run(State.RUNNING, true)}
            >
                Resume
            </Button>
        );
    } else {
        button = (
            <Button
                className={c}
                onClick={() => void run(State.RUNNING)}
            >
                Run
            </Button>
        );
    }

    return (
        <div className='flex gap-[1rem] justify-stretch w-full px-2'>
            {button}
        </div>
    );
}
