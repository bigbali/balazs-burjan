import type { Dispatch, SetStateAction } from 'react';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
};

export type BFSOptionsProps = {
    option: BFSDirection,
    setOption: Dispatch<SetStateAction<BFSDirection>>
};

export const BFSOptions = ({ option, setOption }: BFSOptionsProps) => {
    return (
        <div>
            <label htmlFor='bfsdirection'>
                Breadth-First Search directions:
            </label>
            <select
                id='bfsdirection'
                className='capitalize'
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
