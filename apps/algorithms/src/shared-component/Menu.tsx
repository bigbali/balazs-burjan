import type { PropsWithChildren } from 'react';

export type MenuProps = {
    ModeSelector: React.JSX.Element
} & PropsWithChildren;

export default function Menu({ ModeSelector, children }: MenuProps) {
    return (
        <div className='flex flex-col h-full gap-2 p-2 bg-white border rounded-lg w-[35rem] border-theme-border-light'>
            <div className='flex justify-between gap-4 mb-4'>
                {ModeSelector}
            </div>
            {children}
        </div>
    );
}