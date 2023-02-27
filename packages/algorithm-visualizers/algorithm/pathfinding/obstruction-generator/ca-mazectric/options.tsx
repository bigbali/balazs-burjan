import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import FieldRangeInput from 'ui/FieldRangeInput';

export type CellularAutomataProps = {
    options: {
        setAlive: number,
        keepAlive: {
            min: number,
            max: number
        },
        interrupt: boolean
    },
    setOptions: Dispatch<SetStateAction<CellularAutomataProps['options']>>
};

enum CAPreset {
    MAZE = 'maze',
    MAZECTRIC = 'mazectric',
    CWOL = 'conway\'s way of life'
};

export const CAOptions = ({ options, setOptions }: CellularAutomataProps) => {
    const [preset, setPreset] = useState(CAPreset.MAZECTRIC);
    const { setAlive, keepAlive, interrupt } = options;
    return (
        <div className='flex gap-2'>
            {/* <FieldRangeInput
                label='Rows'
                defaultValue={rows}
                min={Dimensions.MIN}
                max={Dimensions.MAX}
                step={1}
                onChange={setRowsTransition}
            /> */}
        </div>
    );
};
