import PathfinderContextMenu from './component/PathfinderContextMenu';
import PathfinderCanvas from './component/PathfinderCanvas';
import type React from 'react';
import Menu from '../shared-component/Menu';

export default function PathfinderVisualizer() {
    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <PathfinderCanvas />
            <Menu >
                <PathfinderContextMenu />
            </Menu>
        </div>
    );
}
