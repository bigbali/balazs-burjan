import { create } from 'zustand';

type Color = string;

type RendererOptions = {
    showGridNumbers: boolean;
    setShowGridNumbers: (showGridNumbers: boolean) => void;
    color: {
        node: {
            default: Color,
            highlight: Color,
            backtrace: Color,
            selected: Color
        },
        border: Color,
    },
    setColor: (data: Partial<RendererOptions['color']>) => void;
};

export const useRendererOptions = create<RendererOptions>((set) => ({
    showGridNumbers: true,
    setShowGridNumbers: (showGridNumbers) => {
        set(() => ({ showGridNumbers }));
    },
    color: {
        node: {
            default: 'red',
            highlight: 'blue',
            backtrace: 'yellow',
            selected: 'purple'
        },
        border: 'black'
    },
    setColor: (data) => {set((state) => ({
        color: {
            ...state.color,
            ...data,
            node: {
                ...state.color.node,
                ...data.node
            }
        }
    }));}
}));
