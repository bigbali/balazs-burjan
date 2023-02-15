import { debounce } from 'lodash';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { Either } from '../util/type';

type BaseFieldRangeInputProps = {
    min: number,
    max: number,
    step: number,
    defaultValue: number,
    debounceRange?: boolean,
    label: string
};

type GeneralOnChange = {
    onChange: (value: number) => void
};

type SpecializedOnChange = {
    onFieldChange: (value: number) => void,
    onRangeChange: (value: number) => void
};

/**
 * If `onFieldChange` and `onRangeChange` are both provided, `onChange` is disallowed, and vice versa.\
 * If `onChange` is provided, it will be used. Even if you go around the type checker and provide all three
 * methods, `onChange` will override the other two.
 */
type FieldRangeInputProps = BaseFieldRangeInputProps & Either<GeneralOnChange, SpecializedOnChange>;

type FieldRangeInputHandlerOptions = {
    event: ChangeEvent<HTMLInputElement>,
    min: number,
    max: number,
    defaultValue: number,
    debounce?: boolean,
    callback: (value: number) => void,
    setter: Dispatch<SetStateAction<number | null>>
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
    waitForPossibleRangeInput.cancel();

    const parsedValue = Number.parseInt(event.target.value);

    if (Number.isNaN(parsedValue)) {
        setter(null);
        waitForPossibleFieldInput(() => {
            setter(defaultValue);
            callback(defaultValue);
        });

        return;
    }

    // set the state early, and if it's incorrect, it will be corrected after with `waitForPossibleFieldInput`
    setter(parsedValue);

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

    if (debounce) {
        waitForPossibleRangeInput(() => {
            setter(parsedValue);
            callback(parsedValue);
        });
    }
    else {
        callback(parsedValue);
    }
};

const FieldRangeInput = ({
    min = 1,
    max = 100,
    step = 1,
    defaultValue = 50,
    debounceRange = true,
    label,
    onFieldChange,
    onRangeChange,
    onChange
}: FieldRangeInputProps) => {
    const [value, setValue] = useState<number | null>(defaultValue);

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
                className='border border-slate-300 rounded-md text-center'
                type='number'
                id='columns'
                max={max}
                min={min}
                step={step}
                value={value || ''}
                onChange={(e) => handleFieldRangeInputChange({
                    event: e,
                    min: min,
                    max: max,
                    defaultValue: defaultValue,
                    debounce: false,
                    setter: setValue,
                    callback: fieldCallback
                })}
            />
            <input
                type='range'
                max={max}
                min={min}
                step={step}
                value={value || min}
                onChange={(e) => handleFieldRangeInputChange({
                    event: e,
                    min: min,
                    max: max,
                    defaultValue: defaultValue,
                    debounce: debounceRange,
                    setter: setValue,
                    callback: rangeCallback
                })}
            />
        </div>
    );
};

export default FieldRangeInput;