import Menu from '../shared-component/Menu';
import SorterCanvas from './component/SorterCanvas';
import SorterContextMenu from './component/SorterContextMenu';

export default function SorterVisualizer() {
    return (
        <div className='w-full h-full p-2 overflow-hidden flex gap-[1rem] justify-between'>
            <SorterCanvas />
            <Menu>
                <SorterContextMenu />
            </Menu>
        </div>
    );
}
