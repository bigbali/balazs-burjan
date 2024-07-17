import { useEffect, useRef } from 'react';
import SorterRenderer from '../renderer';
import useSorterStore from '../hook/useSorterStore';

export default function SorterCanvas() {
    const { values, setRenderer } = useSorterStore();
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current) {
            setRenderer(new SorterRenderer(canvas.current, values));
        }
    }, [canvas.current]);

    return (
        <div className='relative grid w-full h-full overflow-hidden place-items-center'>
            <canvas ref={canvas}>
            </canvas>
        </div>
    );
}
