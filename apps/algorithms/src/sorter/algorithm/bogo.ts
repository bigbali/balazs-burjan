import type { Result } from '../../type';
import { State } from '../../type';
import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class BogoSort {
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
            for (let i = values.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [values[i], values[j]] = [values[j]!, values[i]!];

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

            sorted = true;
            for (let i = 0; i < values.length - 1; i++) {
                if (values[i]! > values[i + 1]!) {
                    sorted = false;
                }
            }
        }

        return {
            state: 'done',
            result: [...values]
        };
    }
}