import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const persistentStore = (key: string, value: string) => {
    const { subscribe, set } = writable(value);

    return {
        subscribe,
        set,
        new: () => {
            set(localStorage.getItem(key) ?? '');

            subscribe(current => {
                localStorage.setItem(key, current);
            });
        }
    };
};

export const prevPageStore = persistentStore('prevPage', '');

if (browser)
    prevPageStore.new();