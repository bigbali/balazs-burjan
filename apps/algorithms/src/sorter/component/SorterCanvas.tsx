import { useEffect, useRef } from 'react';
import SorterRenderer from '../renderer';
import useSorterStore from '../hook/useSorterStore';

export default function SorterCanvas() {
    const { renderer, setRenderer } = useSorterStore();
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current && !renderer) {
            setRenderer(new SorterRenderer(canvas.current, [1,2,3,6,9,4,5,6]));
        }
    }, [canvas.current]);

    return (
        <div className='relative grid w-full h-full overflow-hidden place-items-center'>
            <canvas ref={canvas}>
            </canvas>
        </div>
    );
}
