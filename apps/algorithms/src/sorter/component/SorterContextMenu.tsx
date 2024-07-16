import type { ChangeEventHandler } from 'react';
import useSorterStore from '../hook/useSorterStore';
import { toNumber } from 'lodash';
import { FieldRangeInput } from 'ui-react19';

export default function SorterContextMenu() {
    const { renderer } = useSorterStore();

    const c: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (renderer) {
            renderer.draw(e.currentTarget.value.split(',').map(a => toNumber(a)));
        }
    };
    return <div>
        <input className='border border-theme-primary h-[1rem] w-full' type='text' onChange={c} />
    </div>;
}