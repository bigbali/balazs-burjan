import Select, { SelectItem } from 'ui-react19/Select';
import type { OptionsComponentProps } from '../../../type';
import Label from 'ui-react19/Label';

export enum DFSDirection {
    LRBT = 'left, right, down, up',
    LRTB = 'left, right, up, down',
    RLTB = 'right, left, up, down',
    RLBT = 'right, left, down, up'
}

export type DFSOptions = {
    direction: DFSDirection
};

export const DEPTH_FIRST_SEARCH_DEFAULT_OPTIONS: DFSOptions = {
    direction: DFSDirection.LRBT
};

export const DFSOptionsComponent = ({ options, setOptions }: OptionsComponentProps<DFSOptions>) => {
    return (
        <Label className='flex flex-col gap-[0.5rem]'>
            <span className='text-muted-foreground'>
                Directions
            </span>
            <Select
                value={options.direction}
                onValueChange={(value) => setOptions({ direction: value as DFSDirection })}
            >
                {Object.values(DFSDirection).map((value) => (
                    <SelectItem
                        className='capitalize'
                        value={value}
                        key={value}
                    >
                        {value}
                    </SelectItem>
                ))}
            </Select>
        </Label>
    );
};
