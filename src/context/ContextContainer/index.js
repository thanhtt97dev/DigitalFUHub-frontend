import Notification from '~/context/UI/NotificationContext';
import { Chat } from "~/context/SignalR/ChatContext";
import NotificationMessageContext from '~/context/UI/NotificationMessageContext';
import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";

function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                <UserOnlineStatus>
                    <Chat>
                        <NotificationMessageContext>
                            {children}
                        </NotificationMessageContext>
                    </Chat>
                </UserOnlineStatus>
            </Notification>
        </>
    );
}

export default ContextContainer;