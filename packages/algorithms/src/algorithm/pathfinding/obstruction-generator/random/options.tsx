import { memo, useCallback } from 'react';
import FieldRangeInput from 'ui/FieldRangeInput';
import type { ObstructionGeneratorOptionsProps } from '..';

export type RandomOptions = {
    probability: number
};

export const RANDOM_DEFAULT_OPTIONS: RandomOptions = {
    probability: 50
};

const RandomObstructionGeneratorOptions = ({ setOptions }: ObstructionGeneratorOptionsProps<RandomOptions>) => {
    const handleChange = useCallback((probability: number) => setOptions({ probability }), [setOptions]);

    return (
        <FieldRangeInput
            label='Probability'
            title='Chance of a node to be marked as an obstruction'
            defaultValue={RANDOM_DEFAULT_OPTIONS.probability}
            className='flex gap-2'
            fieldStyle={{ marginLeft: 'auto' }}
            onChange={handleChange}
        />
    );
};

export default memo(RandomObstructionGeneratorOptions);