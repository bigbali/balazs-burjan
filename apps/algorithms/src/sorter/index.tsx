import Menu from '../shared-component/Menu';
import type { VisualizerProps } from '../type';
import SorterCanvas from './component/SorterCanvas';
import SorterContextMenu from './component/SorterContextMenu';

export default function SorterVisualizer({ ModeSelector }: VisualizerProps) {
    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <SorterCanvas />
            <Menu ModeSelector={ModeSelector}>
                <SorterContextMenu />
            </Menu>
        </div>
    );
}
