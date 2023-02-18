import type { Dispatch, SetStateAction } from 'react';
import { DFSDirection } from './direction';

export type DFSOptionsProps = {
    option: DFSDirection,
    setOption: Dispatch<SetStateAction<DFSDirection>>
};

export const DFSOptions = ({ option, setOption }: DFSOptionsProps) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='dfsdirection'>
                Directions:
            </label>
            <select
                id='dfsdirection'
                className='border border-slate-3 rounded-md capitalize px-4'
                value={option}
                onChange={(e) => {
                    setOption(e.currentTarget.value as DFSDirection);
                }}>
                {Object.values(DFSDirection).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
