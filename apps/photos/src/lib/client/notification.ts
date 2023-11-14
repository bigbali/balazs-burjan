import { writable } from "svelte/store";

interface Notification {
    title?: string,
    message?: string,
    timeout: number
}

interface NotificationMeta extends Notification {
    id: string,
    timeoutId: NodeJS.Timeout
}

export const notifications = writable<NotificationMeta[]>([]);

export const notify = ({ timeout, title, message }: Notification) => {
    if (timeout === 0 || (!title && !message)) return;

    const id = `${title}${message}${timeout}${new Date().getTime()}`;
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
        notifications.update(store => store.filter(notif => notif.id !== id));
        clearTimeout(timeoutId);
    }, timeout);

    notifications.update(store => [{ timeout, title, message, id, timeoutId }, ...store]);
}

export const cancel = (id: string) => {
    notifications.update(store => {
        clearTimeout(store.find(meta => meta.id === id)?.timeoutId);
        return store.filter(notif => notif.id !== id);
    });
}