import type { OptionsComponentProps } from '../../../type';

export enum DFSDirection {
    LRBT = 'left, right, down, up',
    LRTB = 'top to bottom, right to left',
    RLTB = 'bottom to top, left to right',
    RLBT = 'bottom to top, right to left'
}

export type DFSOptions = {
    direction: DFSDirection
};

export const DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS: DFSOptions = {
    direction: DFSDirection.LRBT
};

export const DFSOptionsComponent = ({ options, setOptions }: OptionsComponentProps<DFSOptions>) => {
    return (
        <div className='flex gap-2'>
            <label htmlFor='dfsdirection'>
                Directions:
            </label>
            <select
                id='dfsdirection'
                className='px-4 capitalize border rounded-md border-slate-3'
                value={options.direction}
                onChange={(e) => {
                    setOptions({ direction: e.currentTarget.value as DFSDirection });
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
