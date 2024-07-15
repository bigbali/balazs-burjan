import PathfinderContextMenu from './component/PathfinderContextMenu';
import Grid from './component/Grid';
import type React from 'react';

export type PathfinderVisualizerProps = {
    ModeSelector: React.JSX.Element,
};

export default function PathfinderVisualizer({ ModeSelector }: PathfinderVisualizerProps) {
    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <Grid />
            <PathfinderContextMenu ModeSelector={ModeSelector} />
        </div>
    );
}
