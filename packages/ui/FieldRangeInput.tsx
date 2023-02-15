import { debounce } from 'lodash';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { Either } from '../util/type';

type BaseFieldRangeInputProps = {
    min: number,
    max: number,
    step: number,
    defaultValue: number,
    label: string
};

type GeneralOnChange = {
    onChange: (value: number) => void
};

type SpecializedOnChange = {
    onFieldChange: (value: number) => void,
    onRangeChange: (value: number) => void
};

type FieldRangeInputProps = BaseFieldRangeInputProps & Either<GeneralOnChange, SpecializedOnChange>;

type FieldRangeInputHandlerOptions = {
    event: ChangeEvent<HTMLInputElement>,
    min: number,
    max: number,
    defaultValue: number,
    debounce: boolean,
    callback: (value: number) => void,
    setter: Dispatch<SetStateAction<number>>
};

/**
 * When user is typing a digit that is smaller than the minimum, we do not know if he is going to type another number or not.\
 * This could mean that the user is intending to type `12`, but our minimum is set to `1`. In usual input validation implementations,
 * this would cause `1` to be replaced by `min`. We are using debouncing like so to prevent this from happening.
 */
const waitForPossibleFieldInput = debounce((callback: () => void) => callback(), 500);
const waitForPossibleRangeInput = debounce((callback: () => void) => callback(), 200);

export const handleFieldRangeInputChange = ({
    event,
    min,
    max,
    defaultValue,
    debounce,
    callback,
    setter
}: FieldRangeInputHandlerOptions) => {
    // cancel pending state updates
    waitForPossibleFieldInput.cancel();

    const parsedValue = Number.parseInt(event.target.value);

    if (Number.isNaN(parsedValue)) {
        waitForPossibleFieldInput(() => {
            setter(defaultValue);
            callback(defaultValue);
        });
    }

    if (parsedValue < min) {
        waitForPossibleFieldInput(() => {
            setter(min);
            callback(min);
        });

        return;
    }

    if (parsedValue > max) {
        waitForPossibleFieldInput(() => {
            setter(max);
            callback(max);
        });

        return;
    }

    if (parsedValue >= min && parsedValue <= max) {
        if (debounce) {
            waitForPossibleRangeInput(() => {
                setter(parsedValue);
                callback(parsedValue);
            });

            return;
        }

        setter(parsedValue);
        callback(parsedValue);
    }
};

const FieldRangeInput = ({
    min = 1,
    max = 100,
    step = 1,
    defaultValue = 50,
    label,
    onFieldChange,
    onRangeChange,
    onChange
}: FieldRangeInputProps) => {
    const [value, setValue] = useState(defaultValue);

    const fieldCallback = !!onChange
        ? onChange
        : onFieldChange;
    const rangeCallback = !!onChange
        ? onChange
        : onRangeChange;

    return (
        <div className='flex gap-2'>
            {label && (
                <label htmlFor='columns'>
                    {label}
                </label>
            )}
            <input
                type='number'
                id='columns'
                max={max}
                min={min}
                step={step}
                value={value}
                onChange={(e) => handleFieldRangeInputChange({
                    event: e,
                    min: min,
                    max: max,
                    defaultValue: defaultValue,
                    debounce: false,
                    setter: setValue,
                    callback: fieldCallback
                })}
                className='border border-slate-300 rounded-md text-center'
            />
            <input
                type='range'
                max={max}
                min={min}
                step={step}
                value={value}
                onChange={() => { }}
            />
        </div>
    );
};

export default FieldRangeInput;