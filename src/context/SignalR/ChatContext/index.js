import { createContext, useEffect, useState } from "react";

import connectionHub from '~/api/signalr/connectionHub';
import { getUserId } from '~/utils';
import { SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE } from '~/constants';

export const ChatContext = createContext();

export function Chat({ children }) {
    const [message, setMessage] = useState("");
    useEffect(() => {
        var userId = getUserId();
        if (userId === undefined || userId === null) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`hubs/chat?userId=${userId}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        connection.on(SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE, (response) => {
            setMessage(response)
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <ChatContext.Provider value={message}>
            {children}
        </ChatContext.Provider>
    );
}