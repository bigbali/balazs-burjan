import type { Result } from '../../type';
import { State } from '../../type';
import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class InsertionSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]): Generator<void, Result<number[]>, void> {
        const sorter = useSorterStore.getState();

        if (!sorter.renderer) {
            throw Error('no renderer');
        }


        let sorted = false;
        while (!sorted) {
            let change = false;
            for (let i = 0; i < values.length; i++) {
                const state = useSorterStore.getState().state;
                if (state === State.PAUSED) {
                    return {
                        state: 'paused',
                        result: [...values]
                    };
                }

                if (state === State.IDLE) {
                    return {
                        state: 'cancelled',
                        result: [...values]
                    };
                }

                if (i > 0 && values[i]! < values[i - 1]!) {
                    const swap = values[i];
                    values[i] = values[i - 1]!;
                    values[i - 1] = swap!;
                    change = true;
                    sorter.renderer.highlightSwap(i, i - 1);
                } else {
                    sorter.renderer.highlightNoSwap(i, i - 1);
                }

                sorter.renderer.draw(values);
                yield;
            }

            if (!change) {
                sorted = true;
            }
        }

        sorter.renderer.draw(values);

        return {
            state: 'done',
            result: [...values]
        };
    }
}