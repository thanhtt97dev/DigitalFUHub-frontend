import { createContext } from "react";
import { notification } from "antd";

export const NotificationContext = createContext();

function Notification({ children }) {
    const [api, contextHolder] = notification.useNotification({
        // top: 100
    });
    const openNotificationWithIcon = (type = 'success', description = '', message = <b>Thông báo</b>, duration = 5, placement = 'bottomRight') => {
        api[type]({
            message: message,
            description: description,
            duration: duration,
            placement: placement,
        });
    };
    return <NotificationContext.Provider value={openNotificationWithIcon}>
        {contextHolder}
        {children}
    </NotificationContext.Provider>

}

export default Notification;