import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class InsertionSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]) {
        const renderer = useSorterStore.getState().renderer!;

        let sorted = false;
        while (!sorted) {
            let change = false;
            for (let i = 0; i < values.length; i++) {
                if (i > 0 && values[i]! < values[i - 1]!) {
                    const swap = values[i];
                    values[i] = values[i - 1]!;
                    values[i - 1] = swap!;
                    change = true;
                    renderer.highlightSwap(i, i - 1);
                } else {
                    renderer.highlightNoSwap(i, i - 1);
                }

                renderer.draw(values);
                yield;
            }

            if (!change) {
                sorted = true;
            }
        }

        renderer.draw(values);

        return true;
    }
}