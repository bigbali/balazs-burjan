import { dev } from "$app/environment";
import { writable } from "svelte/store";

interface Notification {
    timeout?: number,
    title?: string,
    message?: string,
    type?: 'info' | 'warn' | 'error'
}

interface NotificationMeta extends Notification {
    id: string,
    timeout: number,
    timeoutId: NodeJS.Timeout,
    type: Exclude<Notification['type'], undefined>
}

export const notifications = writable<NotificationMeta[]>([]);

export const notify = ({ timeout = 5000, title, message, type = 'info' }: Notification) => {
    if (!title && !message) return;

    const id = `${title}${message}${timeout}${new Date().getTime()}`;
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
        notifications.update(store => store.filter(notif => notif.id !== id));
        clearTimeout(timeoutId);
    }, timeout);

    notifications.update(store => [{ timeout, title, message, id, timeoutId, type }, ...store]);

    type WindowWithNotificationHistory = Window & typeof globalThis & { notificationHistory: NotificationMeta[] }
    if (dev) {
        if (!(window as WindowWithNotificationHistory).notificationHistory) {
            (window as WindowWithNotificationHistory).notificationHistory = [];
        }

        (window as WindowWithNotificationHistory).notificationHistory.push({ timeout, title, message, id, timeoutId, type });
    }
}

export const cancel = (id: string) => {
    notifications.update(store => {
        clearTimeout(store.find(meta => meta.id === id)?.timeoutId);
        return store.filter(notif => notif.id !== id);
    });
}