import PathfinderRenderer from '../renderer';
import { create } from 'zustand';

type PathfinderRendererStore = {
    renderer: PathfinderRenderer | null,
    setRenderer: (renderer: PathfinderRenderer) => void
};

export const usePathfinderRendererStore = create<PathfinderRendererStore>((set) => ({
    renderer: null,
    setRenderer: (renderer) => set({ renderer })
}));

export default function usePathfinderRenderer() {
    const { renderer, setRenderer } = usePathfinderRendererStore();

    return {
        renderer,
        initialize: (canvas: HTMLCanvasElement) => {
            if (canvas) {
                setRenderer(new PathfinderRenderer(canvas));
            }
        }
    };
}