import type { ObstructionGeneratorOptionsProps } from '..';
import { FieldRangeInput } from 'ui-react19';

export type RandomOptions = {
    probability: number
};

export const RANDOM_DEFAULT_OPTIONS: RandomOptions = {
    probability: 50
};

const RandomObstructionGeneratorOptions = ({ options, setOptions }: ObstructionGeneratorOptionsProps<RandomOptions>) => {
    const handleChange = (probability: number) => setOptions({ probability });

    return (
        <FieldRangeInput
            label='Probability'
            title='Chance of a node to be marked as an obstruction'
            defaultValue={options.probability}
            className='flex gap-2'
            fieldStyle={{ marginLeft: 'auto' }}
            onChange={handleChange}
        />
    );
};

export default RandomObstructionGeneratorOptions;