import Notification from '~/context/NotificationContext';
import { Chat } from "~/context/ChatContext";
import NotificationMessageContext from '~/context/NotificationMessageContext';
import { UserOnlineStatus } from "~/context/UserOnlineStatusContext";

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