'use client';

import type { ComponentPropsWithoutRef, RefAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from './util/cn';

import * as LabelPrimitive from '@radix-ui/react-label';

const labelVariants = cva('text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

type LabelProps = RefAttributes<HTMLLabelElement>
& ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
& VariantProps<typeof labelVariants>;

export default function Label({ className, ref, ...props }: LabelProps) {
    return (
        <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
    );
}
