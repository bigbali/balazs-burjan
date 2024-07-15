import type { OptionsComponentProps } from '../../../type';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
}

export type BFSOptions = {
    direction: BFSDirection
};

export const BREADTH_FIRST_SEARCH_DEFAULT_OPTIONS: BFSOptions = {
    direction: BFSDirection.ORTHOGONAL
};

export const BFSOptionsComponent = ({ options, setOptions }: OptionsComponentProps<BFSOptions>) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='bfsdirection'>
                Directions:
            </label>
            <select
                id='bfsdirection'
                className='px-4 capitalize border rounded-md border-slate-3'
                value={options.direction}
                onChange={(e) => {
                    setOptions({ direction: e.currentTarget.value as BFSDirection });
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
