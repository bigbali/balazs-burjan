import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class BubbleSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]) {
        let sorted = false;
        while (!sorted) {
            let change = false;
            for (let i = 0; i < values.length; i++) {
                if (i > 0 && values[i]! < values[i - 1]!) {
                    const swap = values[i];
                    values[i] = values[i - 1]!;
                    values[i - 1] = swap!;
                    change = true;
                    useSorterStore.getState().renderer?.highlightSwap(i, i - 1);
                } else {
                    useSorterStore.getState().renderer?.highlightNoSwap(i, i - 1);
                }
                useSorterStore.getState().renderer?.draw(values);
                yield;
            }

            if (!change) {
                sorted = true;
            }
        }

        useSorterStore.getState().renderer?.draw(values);

        return true;
    }
}