import type { Dispatch, SetStateAction } from 'react';
import { BFSDirection } from './direction';

export type BFSOptionsProps = {
    option: BFSDirection,
    setOption: Dispatch<SetStateAction<BFSDirection>>
};

export const BFSOptions = ({ option, setOption }: BFSOptionsProps) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='bfsdirection'>
                Directions:
            </label>
            <select
                id='bfsdirection'
                className='border border-slate-3 rounded-md capitalize px-4'
                value={option}
                onChange={(e) => {
                    setOption(e.currentTarget.value as BFSDirection);
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
