import PathfinderContextMenu from './component/PathfinderContextMenu';
import PathfinderCanvas from './component/PathfinderCanvas';
import type React from 'react';
import type { VisualizerProps } from '../type';
import Menu from '../shared-component/Menu';

export default function PathfinderVisualizer({ ModeSelector }: VisualizerProps) {
    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <PathfinderCanvas />
            <Menu ModeSelector={ModeSelector}>
                <PathfinderContextMenu />
            </Menu>
        </div>
    );
}
