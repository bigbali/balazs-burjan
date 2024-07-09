import { useCallback, useEffect, useState } from 'react';

type Coordinate = {
    x: number,
    y: number
};

export default function useWindowResize(callback: (size: Coordinate) => void) {
    const [state, setState] = useState<Coordinate>({ x: window.innerWidth, y: window.innerHeight });

    const resizeHandler = useCallback(() => setState({ x: window.innerWidth, y: window.innerHeight }), []);

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    useEffect(() => {
        callback(state);
    }, [state]);
}