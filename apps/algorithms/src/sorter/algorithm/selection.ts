import { State, type Result } from '../../type';
import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class SelectionSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]): Generator<void, Result<number[]>, void> {
        const sorter = useSorterStore.getState();

        if (!sorter.renderer) {
            throw Error('no renderer');
        }

        for (let i = 0; i < values.length - 1; i += 1) {
            let min = i;

            for (let j = i + 1; j < values.length; j += 1) {
                sorter.renderer.highlight(j);

                if (values[j]! < values[min]!) {
                    min = j;
                }

                sorter.renderer.draw(values);

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

                yield;
            }

            if (min !== i) {
                [values[i], values[min]] = [values[min]!, values[i]!];
                sorter.renderer.highlightSwap(i, min);
            }
        }

        sorter.renderer.draw(values);

        return {
            state: 'done',
            result: [...values]
        };
    }
}