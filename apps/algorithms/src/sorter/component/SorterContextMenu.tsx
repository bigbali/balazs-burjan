import { useState, type ChangeEventHandler } from 'react';
import useSorterStore from '../hook/useSorterStore';
import { toNumber } from 'lodash';
import BubbleSort from '../algorithm/bubble';
import BogoSort from '../algorithm/bogo';

enum Sorter {
    BUBBLE = 'bubble sort',
    BOGO = 'bogo sort'
}

const SORTER_MAP = {
    [Sorter.BUBBLE]: BubbleSort,
    [Sorter.BOGO]: BogoSort
} as const;

export default function SorterContextMenu() {
    const { renderer, values, setValues } = useSorterStore();
    const [sorter, setSorter] = useState<Sorter>(Sorter.BUBBLE);

    const c: ChangeEventHandler<HTMLInputElement> = (e) => {
        const v = e.currentTarget.value.split(',').map(a => toNumber(a));

        if (renderer) {
            renderer.draw(v);
        }

        setValues(v);
    };

    return <div>
        <input className='border border-theme-primary h-[1rem] w-full' type='text' onChange={c} />
        <button className='w-full text-white border bg-theme-primary' onClick={() => SORTER_MAP[sorter].begin(values)}>
            klik
        </button>
        <select onChange={(e) => setSorter(e.currentTarget.value as Sorter)}>
            {Object.values(Sorter).map((sorter) => (
                <option
                    className='capitalize'
                    value={sorter}
                    key={sorter}
                >
                    {sorter}
                </option>
            ))}
        </select>
    </div>;
}