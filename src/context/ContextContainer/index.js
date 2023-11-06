import Notification from '~/context/UI/NotificationContext';
import { Chat } from "~/context/SignalR/ChatContext";
import NotificationMessageContext from '~/context/UI/NotificationMessageContext';

import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";
import { Notification as NotificationSignalR } from '~/context/SignalR/NotificationContext';

function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                <NotificationSignalR>
                    <UserOnlineStatus>
                        <Chat>
                            <NotificationMessageContext>
                                {children}
                            </NotificationMessageContext>
                        </Chat>
                    </UserOnlineStatus>
                </NotificationSignalR>
            </Notification>
        </>
    );
}

export default ContextContainer;