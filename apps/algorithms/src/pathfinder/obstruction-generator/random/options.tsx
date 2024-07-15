import { type OGOptionsComponentProps } from '..';
import { FieldRangeInput } from 'ui-react19';

export type OGRandomOptions = {
    probability: number
};

export const RANDOM_DEFAULT_OPTIONS: OGRandomOptions = {
    probability: 50
};

const OGRandomOptionsComponent = ({ options, setOptions }: OGOptionsComponentProps<OGRandomOptions>) => {
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

export default OGRandomOptionsComponent;