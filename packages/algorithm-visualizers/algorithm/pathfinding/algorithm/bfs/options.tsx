import type { Dispatch, SetStateAction } from 'react';
import { BFSDirection } from './direction';

export type BFSOptionsProps = {
    options: BFSDirection,
    setOptions: Dispatch<SetStateAction<BFSDirection>>
};

export const BFSOptions = ({ options, setOptions }: BFSOptionsProps) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='bfsdirection'>
                Directions:
            </label>
            <select
                id='bfsdirection'
                className='border border-slate-3 rounded-md capitalize px-4'
                value={options}
                onChange={(e) => {
                    setOptions(e.currentTarget.value as BFSDirection);
                }}>
                {Object.values(BFSDirection).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
