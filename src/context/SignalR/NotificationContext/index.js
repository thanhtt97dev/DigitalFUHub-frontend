import { createContext, useEffect, useState } from "react";

import connectionHub from '~/api/signalr/connectionHub';
import { SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION } from '~/constants';
import { getUserId } from "~/utils";

export const NotificationContext = createContext();

export function Notification({ children }) {

    const [notification, setNotification] = useState("");
    useEffect(() => {
        var userId = getUserId();
        if (userId === null || userId === undefined) return;

        const connection = connectionHub(`hubs/notification?userId=${userId}`);
        connection.start().catch((err) => console.error(err));
        // Create a new SignalR connection with the token

        connection.on(SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, (res) => {
            const notifi = JSON.parse(res);
            setNotification(notifi)
        });

        return () => {
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <NotificationContext.Provider value={notification}>
            {children}
        </NotificationContext.Provider>
    );
}
