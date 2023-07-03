import type { Dispatch } from 'react';

export type ObstructionGeneratorOptionsProps<T> = {
    options: T,
    setOptions: Dispatch<Partial<T>>
};
