import type { Dispatch, SetStateAction } from 'react';
import { DFSDirection } from './direction';

export type DFSOptionsProps = {
    options: DFSDirection,
    setOptions: Dispatch<SetStateAction<DFSDirection>>
};

export const DFSOptions = ({ options, setOptions }: DFSOptionsProps) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='dfsdirection'>
                Directions:
            </label>
            <select
                id='dfsdirection'
                className='border border-slate-3 rounded-md capitalize px-4'
                value={options}
                onChange={(e) => {
                    setOptions(e.currentTarget.value as DFSDirection);
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
