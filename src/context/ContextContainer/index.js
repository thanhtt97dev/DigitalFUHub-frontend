import Notification from '~/context/NotificationContext';
import { Chat } from "~/context/ChatContext";
import { UserOnlineStatus } from "~/context/UserOnlineStatusContext";

function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                <UserOnlineStatus>
                    <Chat>
                        {children}
                    </Chat>
                </UserOnlineStatus>
            </Notification>
        </>
    );
}

export default ContextContainer;