import { useEffect, useRef, useState, type RefObject } from 'react';
import Canvas from '../../../renderer/canvas';
import { create } from 'zustand';
import type { GridData } from '../component/Grid';

type RendererStore = {
    renderer: Canvas | null,
    setRenderer: (renderer: Canvas) => void
};

export const useRendererStore = create<RendererStore>((set) => ({
    renderer: null,
    setRenderer: (renderer) => set({ renderer })
}));

export default function useRenderer(canvas?: RefObject<HTMLCanvasElement>, init?: {x: number, y: number}, data?: GridData) {
    const { renderer, setRenderer } = useRendererStore();

    useEffect(() => {
        if (canvas?.current && init) {
            !renderer && setRenderer(new Canvas(canvas.current, init, data));
        }
    }, [canvas?.current]);

    return renderer;
}