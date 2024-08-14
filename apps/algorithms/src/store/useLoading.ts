import { create } from 'zustand';

interface LoadingStore {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

// TODO useGlobalState<T>, move to shared package

export const useLoading = create<LoadingStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => {
        set(() => ({ isLoading }));
    }
}));
