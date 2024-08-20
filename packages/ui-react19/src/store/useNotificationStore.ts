import { create } from 'zustand';

export type Notification = {
    id: number;
    title: string;
    description: string;
    timeout?: number;
    type: 'success' | 'error' | 'info';
};

interface NotificationStore {
    notifications: Notification[];
    pushNotification: (notification: Omit<Notification, 'id'>) => Notification['id'];
    pushUniqueNotification: (notification: Omit<Notification, 'id'>) => Notification['id'] | false;
    removeNotification: (notification: Notification | Notification['id']) => boolean;
}

// let's start from 1 so we don't get falsy values
let id = 1;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    pushNotification: ({ timeout = 5000, ...notification }) => {
        const _id = id;

        set((state) => {
            return {
                notifications: [
                    ...state.notifications,
                    {
                        ...notification,
                        id: _id
                    }
                ]
            };
        });

        setTimeout(() => get().removeNotification(_id), timeout);

        id++;

        return _id;
    },
    pushUniqueNotification: (notification) => {
        const { notifications } = get();

        if (notifications.some((n) => n.title === notification.title)) {
            return false;
        }

        return get().pushNotification(notification);
    },
    removeNotification: (notification) => {
        let success = false;

        set((state) => {
            const newState = state.notifications.filter(
                (n) => typeof notification === 'number'
                    ? n.id !== notification
                    : n !== notification
            );

            success = newState.length < state.notifications.length;

            return {
                notifications: newState
            };
        });

        return success;
    }
}));
