import Label from 'ui-react19/Label';
import type { OptionsComponentProps } from '../../../type';
import Select, { SelectItem } from 'ui-react19/Select';

export enum BFSDirection {
    ORTHOGONAL = 'orthogonal',
    DIAGONAL = 'diagonal',
    HYBRID = 'hybrid'
}

export type BidirectionalOptions = {
    direction: BFSDirection
};

export const BIDIRECTIONAL_DEFAULT_OPTIONS: BidirectionalOptions = {
    direction: BFSDirection.ORTHOGONAL
};

export const BidirectionalOptionsComponent = ({ options, setOptions }: OptionsComponentProps<BidirectionalOptions>) => {
    return (
        <Label className='flex flex-col gap-[0.5rem]'>
            <span className='text-muted-foreground'>
                Directions
            </span>
            <Select
                value={options.direction}
                onValueChange={(value) => setOptions({ direction: value as BFSDirection })}
            >
                {Object.values(BFSDirection).map((value) => (
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
