import { createContext, useEffect, useLayoutEffect, useState } from "react";

import connectionHub from '~/api/signalr/connectionHub';
import { getUserId } from '~/utils';
import { SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE } from '~/constants';

export const ChatContext = createContext();

function Chat({ children }) {
    const [message, setMessage] = useState("daw");
    useEffect(() => {
        var userId = getUserId();
        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${userId}`);

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

    useLayoutEffect(() => {

    }, [message])

    return (
        <ChatContext.Provider value={message}>
            {children}
        </ChatContext.Provider>
    );
}

export default Chat;