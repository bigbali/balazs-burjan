import type { PropsWithChildren } from 'react';
import ModeSelector from './ModeSelector';

export type MenuProps = PropsWithChildren;

export default function Menu({ children }: MenuProps) {
    return (
        <div className='flex flex-col h-full gap-3 p-2 border-border border rounded-lg w-[35rem] min-w-[35rem]'>
            <div className='flex justify-between gap-4 mb-4'>
                <ModeSelector />
            </div>
            {children}
        </div>
    );
}