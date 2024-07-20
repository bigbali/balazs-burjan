import { sorterGeneratorRunner } from '../../util';
import useSorterStore from '../hook/useSorterStore';

export default class SelectionSort {
    static begin(values: number[]) {
        return sorterGeneratorRunner(this.run(values));
    }

    static *run(values: number[]) {
        const renderer = useSorterStore.getState().renderer!;

        for (let i = 0; i < values.length - 1; i += 1) {
            let min = i;

            for (let j = i + 1; j < values.length; j += 1) {
                renderer.highlight(j);

                if (values[j]! < values[min]!) {
                    min = j;
                }

                renderer.draw(values);

                yield;
            }

            if (min !== i) {
                [values[i], values[min]] = [values[min]!, values[i]!];
                renderer.highlightSwap(i, min);
            }
        }

        renderer.draw(values);

        return true;
    }
}