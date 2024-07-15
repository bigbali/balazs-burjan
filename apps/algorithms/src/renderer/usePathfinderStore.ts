import { create } from 'zustand';
import type { Paused } from '../type';
import { type Entry, Pathfinder } from '../type';
import { Delay, Dimensions, State } from '../type';
import type { MutableRefObject } from 'react';

type Setter<T> = (newState: T) => void;

export type PathfinderStore = {
    columns: number,
    rows: number,
    pathfinder: Pathfinder,
    state: State,
    result: Entry | Paused,
    stepInterval: MutableRefObject<number>,
    setColumns: Setter<number>,
    setRows: Setter<number>,
    setPathfinder: Setter<Pathfinder>,
    setState: Setter<State>,
    setResult: Setter<Entry | Paused>,
    setStepInterval: Setter<number>
};

const usePathfinderStore = create<PathfinderStore>((set) => ({
    columns: Dimensions.DEFAULT,
    rows: Dimensions.DEFAULT,
    pathfinder: Pathfinder.BREADTH_FIRST,
    state: State.IDLE,
    result: null,
    stepInterval: { current: Delay.DEFAULT },
    setColumns: (columns) => set({ columns }),
    setRows: (rows) => set({ rows }),
    setPathfinder: (pathfinder) => set({ pathfinder }),
    setState: (state) => set({ state }),
    setResult: (result) => set({ result }),
    setStepInterval: (stepInterval) => set(() => ({
        stepInterval: {
            current: stepInterval
        }
    }))
}));

export default usePathfinderStore;