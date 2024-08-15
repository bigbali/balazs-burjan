import { useEffect, useRef } from 'react';
import SorterRenderer from '../renderer';
import useSorterStore from '../hook/useSorterStore';
import { useWindowResize } from 'ui-react19';

export default function SorterCanvas() {
    const { values, renderer, setRenderer } = useSorterStore();
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current) {
            setRenderer(new SorterRenderer(canvas.current, values));
        }
    }, [setRenderer, values]);

    useWindowResize(() => {
        requestAnimationFrame(() => renderer?.resize());
    });


    return (
        <div className='relative grid w-full h-full overflow-hidden place-items-center'>
            <canvas ref={canvas} />
        </div>
    );
}
