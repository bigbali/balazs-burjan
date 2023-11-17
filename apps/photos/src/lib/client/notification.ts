import { dev } from "$app/environment";
import { writable } from "svelte/store";

interface Notification {
    timeout?: number,
    title?: string,
    message?: string,
    type?: 'info' | 'warn' | 'error',
}

type ExtendFn = () => number | void;

export interface NotificationMeta extends Notification {
    id: string,
    timeout: number,
    timeoutId: NodeJS.Timeout,
    type: Exclude<Notification['type'], undefined>,
    extend: (cb: ExtendFn) => void,
    extendFnRef: { fn: ExtendFn },
    extendedBy: number,
    cancel: () => void
}

type NotifyReturn = {
    notification: NotificationMeta,
    /** This promise resolves when the notification is closed by the user or automatically. */
    done: Promise<true>
}

export const notifications = writable<NotificationMeta[]>([]);

export const notify = ({ timeout = 5000, title, message, type = 'info' }: Notification): NotifyReturn | undefined => {
    if (!title && !message) return;

    let resolveDone: (value: true) => void;
    const done = new Promise<true>((resolve) => resolveDone = resolve);

    const id = `${title}${message}${timeout}${new Date().getTime()}`;
    const cancelFn = () => {
        if (cancel(id)) {
            resolveDone(true);
        };
    }
    const timeoutId = setTimeout(cancelFn, timeout);

    const extendFnRef = { fn: () => { } }
    const extend = (cb: () => void) => extendFnRef.fn = cb

    const newNotification = {
        id,
        timeout,
        title,
        message,
        timeoutId,
        type,
        cancel: cancelFn,
        extend,
        extendFnRef,
        extendedBy: 0
    };

    notifications.update(store => [newNotification, ...store]);

    type WindowWithNotificationHistory = Window & typeof globalThis & { notificationHistory: NotificationMeta[] }
    if (dev) {
        if (!(window as WindowWithNotificationHistory).notificationHistory) {
            (window as WindowWithNotificationHistory).notificationHistory = [];
        }

        (window as WindowWithNotificationHistory).notificationHistory.push(newNotification);
    }

    return {
        notification: newNotification,
        done
    }
};

const cancel = (id: string) => {
    let done = false;

    notifications.update(store => {
        const notification = store.find(meta => meta.id === id);

        if (!notification) {
            return store;
        }

        if (notification.extendFnRef.fn) {
            const extendedTimeout = notification.extendFnRef.fn();

            if (extendedTimeout) {
                clearTimeout(notification?.timeoutId);
                notification.timeoutId = setTimeout(() => notification.cancel(), extendedTimeout);

                notification.extendedBy += extendedTimeout;

                return store;
            }
        }

        done = true;
        clearTimeout(notification?.timeoutId);
        return store.filter(notif => notif.id !== id);
    });

    return done;
}