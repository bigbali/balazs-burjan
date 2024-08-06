'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

import cn from './util/cn';
import type { ComponentPropsWithRef } from 'react';

type SliderProps = ComponentPropsWithRef<typeof SliderPrimitive.Root>;

export default function Slider({ className, ref, ...props }: SliderProps) {
    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn('relative flex w-full touch-none select-none items-center', className)}
            {...props}
        >
            <SliderPrimitive.Track className='relative w-full h-[0.35rem] overflow-hidden rounded-full bg-tertiary'>
                <SliderPrimitive.Range className='absolute h-full bg-secondary' />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className='block w-4 h-4 transition-colors border-2 rounded-full border-primary bg-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
        </SliderPrimitive.Root>
    );
}
