import type { Coordinate } from './common';

export type Entry<T = object> = (Coordinate & {
    parent: Entry
} & T) | null;