import Renderer from '../../renderer';
import { create } from 'zustand';

type RendererStore = {
    renderer: Renderer | null,
    setRenderer: (renderer: Renderer) => void
};

export const useRendererStore = create<RendererStore>((set) => ({
    renderer: null,
    setRenderer: (renderer) => set({ renderer })
}));

export default function useRenderer(/* canvas: HTMLCanvasElement, resolution: Resolution */) {
    const { renderer, setRenderer } = useRendererStore();

    return {
        renderer,
        initialize: (canvas: HTMLCanvasElement) => {
            if (canvas && !renderer) {
                setRenderer(new Renderer(canvas));
            }
        }
    };
}