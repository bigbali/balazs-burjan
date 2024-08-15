import { generateGravitationalWeightPattern, generateRandomWeightPattern } from './weight-pattern';
import type { OptionsComponentProps } from '../../../type';
import { Label, Select, SelectItem, Button } from 'ui-react19';

export enum WeightPattern {
    GRAVITATIONAL = 'gravitational',
    RANDOM = 'random'
}

export type DijkstraOptions = {
    weightPattern: WeightPattern,
};

export const DIJSKTRA_DEFAULT_OPTIONS: DijkstraOptions = {
    weightPattern: WeightPattern.GRAVITATIONAL
};

export const DijkstraOptionsComponent = ({ options, setOptions }: OptionsComponentProps<DijkstraOptions>) => {
    return (
        <div className='flex flex-col gap-4'>
            <Label className='flex flex-col gap-[0.5rem]'>
                <span className='text-muted-foreground'>
                    Algorithm
                </span>
                <Select
                    value={options.weightPattern}
                    onValueChange={(value) => setOptions({
                        ...options,
                        weightPattern: value as WeightPattern
                    })}
                >
                    {Object.values(WeightPattern).map((value) => (
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
            {options.weightPattern === WeightPattern.RANDOM && (
                <Button
                    className='bg-[#4272c4]'
                    onClick={() => generateRandomWeightPattern()}
                >
                    Generate Random Weight Pattern
                </Button>
            )}
            {options.weightPattern === WeightPattern.GRAVITATIONAL && (
                <Button
                    className='bg-[#4d8eb4]'
                    onClick={() => generateGravitationalWeightPattern()}
                >
                    Generate Gravitational Weight Pattern
                </Button>
            )}
        </div>
    );
};
