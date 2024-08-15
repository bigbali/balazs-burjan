import type {
    ChangeEvent,
    Dispatch,
    HTMLAttributes,
    SetStateAction,
    CSSProperties
} from 'react';
import { useEffect, useId, useState } from 'react';
import { debounce } from 'lodash';
import Slider from './Slider';
import type { Either } from 'c:/Users/bigba/Desktop/Projects/my-turborepo/packages/util/type';
import Input from './Input';

type BaseFieldRangeInputProps = {
    min?: number,
    max?: number,
    step?: number,
    defaultValue?: number,
    value?: number,
    debounceRange?: boolean,
    label: string,
    labelStyle?: CSSProperties,
    fieldStyle?: CSSProperties,
    rangeStyle?: CSSProperties,
    containerStyle?: CSSProperties
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
type FieldRangeInputProps = BaseFieldRangeInputProps
    & Either<GeneralOnChange, SpecializedOnChange>
    & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>;

type FieldRangeInputHandlerOptions = {
    event?: ChangeEvent<HTMLInputElement>,
    values?: number[],
    min: number,
    max: number,
    defaultValue: number,
    step: number,
    debounce?: boolean,
    callback: (value: number) => void,
    setter: Dispatch<SetStateAction<number | null>>
};

/**
 * When user is typing a digit that is smaller than the minimum, we do not know if he is going to type another number or not.\
 * This could mean that the user intends to type `12`, but our minimum is set to `1`. In usual input validation implementations,
 * this would cause `1` to be replaced by `min`. We are using debouncing like so to prevent this from happening.
 */
const waitForPossibleFieldInput = debounce((callback: () => void) => callback(), 500);
const waitForPossibleRangeInput = debounce((callback: () => void) => callback(), 200);

export const handleFieldRangeInputChange = ({
    event,
    values,
    min,
    max,
    defaultValue,
    step,
    debounce,
    callback,
    setter
}: FieldRangeInputHandlerOptions) => {
    // cancel pending state updates
    waitForPossibleFieldInput.cancel();
    waitForPossibleRangeInput.cancel();

    let parsedValue = 0;

    if (event) {
        parsedValue = Number.isInteger(step)
            ? Number.parseInt(event.target.value)
            : Number.parseFloat(event.target.value);
    } else if (values) {
        parsedValue = values[0]!;
    }

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

export default function FieldRangeInput ({
    min = 1,
    max = 100,
    step = 1,
    defaultValue = 50,
    value,
    debounceRange = true,
    label,
    onFieldChange,
    onRangeChange,
    onChange,
    labelStyle,
    fieldStyle,
    rangeStyle,
    containerStyle,
    ...props
}: FieldRangeInputProps) {
    const [_value, _setValue] = useState<number | null>(value ?? defaultValue);
    const id = useId();

    const fieldCallback = onChange
        ? onChange
        : onFieldChange;
    const rangeCallback = onChange
        ? onChange
        : onRangeChange;

    useEffect(() => {
        value && _setValue(value);
    }, [value]);

    return (
        <div {...props}>
            {label && (
                <label htmlFor={id} style={labelStyle} className='flex items-center text-sm font-medium'>
                    {label}
                </label>
            )}
            <div className='flex gap-[1rem] ml-auto flex-1 w-[20rem] max-w-[20rem]' style={containerStyle}>
                <Input
                    type='number'
                    className='w-auto h-auto py-1 pr-0 text-center border border-theme-border-light'
                    style={{ maxWidth: `calc(${max.toString().length}ch + 3rem)`, paddingInlineStart: '0.5rem', ...fieldStyle }}
                    id={id}
                    max={max}
                    min={min}
                    step={step}
                    value={_value ?? min}
                    onChange={(event) => handleFieldRangeInputChange({
                        event,
                        min,
                        max,
                        defaultValue,
                        step,
                        debounce: false,
                        setter: _setValue,
                        callback: fieldCallback
                    })}

                />
                <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={[_value ?? min]}
                    style={rangeStyle}
                    onValueChange={(values) => handleFieldRangeInputChange({
                        values,
                        min,
                        max,
                        step,
                        defaultValue,
                        debounce: debounceRange,
                        setter: _setValue,
                        callback: rangeCallback
                    })}
                />
            </div>
        </div>
    );
}

