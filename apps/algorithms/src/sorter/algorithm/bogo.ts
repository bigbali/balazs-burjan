import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class BogoSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]) {
        let sorted = false;
        while (!sorted) {
            for (let i = values.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [values[i], values[j]] = [values[j]!, values[i]!];

                useSorterStore.getState().renderer?.draw(values);
                yield;
            }

            sorted = true;
            for (let i = 0; i < values.length - 1; i++) {
                if (values[i]! > values[i + 1]!) {
                    sorted = false;
                }
            }
        }

        return true;
    }
}