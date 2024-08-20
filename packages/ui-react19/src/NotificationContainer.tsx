import { NotificationDescription, NotificationTitle, Notification } from './Notification';
import { useNotificationStore } from './store/useNotificationStore';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function NotificationContainer() {
    const { notifications } = useNotificationStore();
    const [animate] = useAutoAnimate();

    return (
        <div className='fixed top-0 inset-x-0 mt-[10rem] mx-auto z-50 flex flex-col gap-2 p-2 w-[25dvw]' ref={animate}>
            {notifications.map((notification) => (
                <Notification variant={notification.type} key={notification.id}>
                    <NotificationTitle notificationId={notification.id}>
                        {notification.title}
                    </NotificationTitle>
                    <NotificationDescription>
                        {notification.description}
                    </NotificationDescription>
                </Notification>
            ))}
        </div>
    );
}