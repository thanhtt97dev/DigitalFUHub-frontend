import { createContext } from "react";
import { notification } from "antd";

export const NotificationContext = createContext();

function Notification({ children }) {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type = 'success', message = '', description = '', duration = 4.5, placement = 'topRight') => {
        api[type]({
            message: message,
            description: description,
            duration: duration,
            placement: placement
        });
    };
    return <NotificationContext.Provider value={openNotificationWithIcon}>
        {contextHolder}
        {children}
    </NotificationContext.Provider>

}

export default Notification;