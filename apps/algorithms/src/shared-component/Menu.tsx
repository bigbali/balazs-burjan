import type { PropsWithChildren } from 'react';
import ModeSelector from './ModeSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export type MenuProps = PropsWithChildren;

export default function Menu({ children }: MenuProps) {
    return (
        <div className='flex h-full w-[35rem] min-w-[35rem] flex-col gap-3 rounded-lg border border-border p-2 overflow-y-auto'>
            <div className='flex justify-between gap-4 mb-4'>
                <ModeSelector />
                <p className='flex flex-1 items-center gap-[1rem] text-sm'>
                    <FontAwesomeIcon
                        color='#323538'
                        icon={faInfoCircle}
                        className='w-4 h-4'
                    />
                    Under development.
                </p>
            </div>
            {children}
        </div>
    );
}