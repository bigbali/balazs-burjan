import { isBoolean } from 'lodash';
import { memo, useState } from 'react';
import type { PropsWithChildren, DetailsHTMLAttributes } from 'react';

type ExpanderProps = {
    label: string,
    openOverride?: boolean
} & PropsWithChildren & DetailsHTMLAttributes<HTMLDetailsElement>;

/**
 * A component that can be expanded and unexpanded.\
 * If the `open` prop is a boolean, the component becomes controlled, otherwise it's uncontrolled.\
 * It accepts the attributes of the `<details>` HTML tag and an additional `label`
 * prop which is internally rendered inside a `<summary>`
 */
const Expander = ({ open, openOverride, onToggle, label, children, ...props }: ExpanderProps) => {
    const [openInternal, setOpenInternal] = useState(open);

    return (
        <details
            {...props}
            open={openOverride || openInternal}
            onToggle={(e) => {
                if (isBoolean(openInternal)) {
                    setOpenInternal(state => !state);
                }

                if (onToggle) {
                    onToggle(e);
                }
            }}
        >
            <summary className='cursor-pointer border border-slate-300 rounded-lg'>
                {label}
            </summary>
            {children}
        </details>
    );
};

export default memo(Expander);