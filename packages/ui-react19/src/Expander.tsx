import { isBoolean } from 'lodash';
import { useRef, useState } from 'react';
import type { PropsWithChildren, DetailsHTMLAttributes } from 'react';

type ExpanderProps = {
    label: string,
    openInitial?: boolean
} & PropsWithChildren & DetailsHTMLAttributes<HTMLDetailsElement>;

/**
 * A component that can be expanded and unexpanded.\
 * If the `open` prop is a boolean, the component becomes controlled, otherwise it's uncontrolled.\
 * It accepts the attributes of the `<details>` HTML tag and an additional `label`
 * prop which is internally rendered inside a `<summary>`.\
 * Use the `openOverride` prop to force the open state of the component.
 */
export default function Expander ({ open, openInitial, onToggle, label, children, ...props }: ExpanderProps) {
    const [openInternal, setOpenInternal] = useState(openInitial);
    const isOnToggleTriggeredByStateChange = useRef(false);

    return (
        <div className='border rounded-lg border-slate-300'>
            <details
                {...props}
                open={open || openInternal}
                onToggle={(e) => {
                    if (isBoolean(openInternal)) {
                        isOnToggleTriggeredByStateChange.current = !isOnToggleTriggeredByStateChange.current;

                        if (!isOnToggleTriggeredByStateChange.current) {
                            setOpenInternal(state => !state);
                        }
                    }

                    if (onToggle) {
                        onToggle(e);
                    }
                }}
            >
                <summary className='cursor-pointer'>
                    {label}
                </summary>
                {children}
            </details>
        </div>
    );
};
