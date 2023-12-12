import React, { useState } from "react";

import { Chat } from "~/context/SignalR/ChatContext";
import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";
import { Notification as NotificationSignalR } from '~/context/SignalR/NotificationContext';

import { getUserId } from "~/utils";


function SignalR({ children }) {

    const [userId, setUserId] = useState(undefined);

    setInterval(() => {
        setUserId(getUserId())
    }, 10000)

    return (
        <>
            {(userId === null || userId === undefined) ?
                <>{children}</>
                :
                <>
                    <NotificationSignalR>
                        <UserOnlineStatus>
                            <Chat>
                                {children}
                            </Chat>
                        </UserOnlineStatus>
                    </NotificationSignalR>
                </>
            }

        </>
    );
}

export default SignalR;