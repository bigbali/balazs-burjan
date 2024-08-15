import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

export enum Mode {
    PATHFINDER = 'pathfinder',
    SORTER = 'sorter'
}

const PathfinderVisualizer = dynamic(() => import('../pathfinder'), { ssr: false });
const SorterVisualizer = dynamic(() => import('../sorter'), { ssr: false });

const ALGORITHM_VISUALIZER_MAP = {
    [Mode.PATHFINDER]: PathfinderVisualizer,
    [Mode.SORTER]: SorterVisualizer
} as const;

export default function Algorithms() {
    const router = useRouter();

    const mode = router.query.mode ?? Mode.PATHFINDER;

    if (typeof mode !== 'string' || !(mode in ALGORITHM_VISUALIZER_MAP)) {
        return (
            <div className='grid items-center w-full h-full'>
                <p className='text-[2rem] text-center'>
                    This page does not exist.
                </p>
            </div>
        );
    }

    const Visualizer = ALGORITHM_VISUALIZER_MAP[mode as Mode];

    return (
        <Visualizer key={mode} />
    );
}
