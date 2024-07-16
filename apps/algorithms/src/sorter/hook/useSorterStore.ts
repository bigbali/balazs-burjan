import { create } from 'zustand';
import { State } from '../../type';
import { Delay } from '../../type';
import { type MutableRefObject } from 'react';
import type SorterRenderer from '../renderer';

type Setter<T> = (newState: T) => void;

export type SorterStore = {
    renderer: SorterRenderer | null,
    values: number[],
    state: State,
    stepInterval: MutableRefObject<number>
    setRenderer: Setter<SorterRenderer>,
    setValues: Setter<number[]>,
    setState: Setter<State>,
    setStepInterval: Setter<number>,
};

const useSorterStore = create<SorterStore>((set) => ({
    renderer: null,
    values: [],
    state: State.IDLE,
    stepInterval: { current: Delay.DEFAULT },
    setRenderer: (renderer) => set({ renderer }),
    setValues: (values) => set({ values }),
    setState: (state) => set({ state }),
    setStepInterval: (stepInterval) => set(() => ({
        stepInterval: {
            current: stepInterval
        }
    }))
}));

export default useSorterStore;