import type { Dispatch, SetStateAction } from 'react';

export type Coordinate = {
    x: number,
    y: number
};

export type Entry<T = object> = (Coordinate & {
    parent: Entry
} & T) | null;

export type ForwardedState<T = unknown> = [T, Dispatch<SetStateAction<T>>];

export type ValueOf<T> = T[keyof T];

export const enum MouseButton {
    NONE,
    LEFT,
    RIGHT
};
