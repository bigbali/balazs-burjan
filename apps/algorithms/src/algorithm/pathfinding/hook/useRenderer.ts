import { useEffect, useRef, useState, type RefObject } from 'react';
import Canvas from '../../../renderer/canvas';
import { create } from 'zustand';

type RendererStore = {
    renderer: Canvas | null,
    setRenderer: (renderer: Canvas) => void
};

const useRendererStore = create<RendererStore>((set) => ({
    renderer: null,
    setRenderer: (renderer) => set({ renderer })
}));

export default function useRenderer(canvas?: RefObject<HTMLCanvasElement>, init?: {x: number, y: number}) {
    const { renderer, setRenderer } = useRendererStore();

    useEffect(() => {
        if (canvas?.current && init) {
            !renderer && setRenderer(new Canvas(canvas.current, init));
        }
    }, [canvas?.current]);

    return renderer;
}