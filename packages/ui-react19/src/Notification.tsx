import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import cn from './util/cn';
import { type Notification as NotificationType, useNotificationStore } from './store/useNotificationStore';

const NotificationVariants = cva(
    `relative w-full rounded-lg border p-4
    [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground`,
    {
        variants: {
            variant: {
                info: 'bg-background text-foreground border-primary',
                error: 'border-destructive/50 bg-destructive text-primary-foreground [&>svg]:text-destructive',
                success: 'border-destructive/50 bg-[#0ad100] [&>svg]:text-destructive'
            }
        },
        defaultVariants: {
            variant: 'info'
        }
    }
);

type NotificationProps =
    React.HTMLAttributes<HTMLDivElement>
    & React.RefAttributes<HTMLDivElement>
    & VariantProps<typeof NotificationVariants>;

function Notification({ className, variant, ref, ...props }: NotificationProps) {
    return (
        <div
            ref={ref}
            role='alert'
            className={cn(NotificationVariants({ variant }), className)}
            {...props}
        />
    );
}

type NotificationTitleProps =
    React.HTMLAttributes<HTMLParagraphElement>
    & React.RefAttributes<HTMLParagraphElement>
    & { notificationId: NotificationType['id'] };

function NotificationTitle({ className, children, ref, notificationId, ...props }: NotificationTitleProps) {
    const { removeNotification } = useNotificationStore();

    return (
        <p ref={ref} className={cn('flex items-center gap-4 mb-1 font-medium leading-none tracking-tight', className)} {...props}>
            <span className='flex flex-1 p-1 text-sm'>{children}</span>
            <button className='p-1 font-mono hover:text-destructive' onClick={() => removeNotification(notificationId)}>
                X
            </button>
        </p>
    );
}

const NotificationDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('text-sm p-1 [&_p]:leading-relaxed', className)}
        {...props}
    />
));
NotificationDescription.displayName = 'NotificationDescription';

export { Notification, NotificationTitle, NotificationDescription };
