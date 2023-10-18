import Notification from '~/context/NotificationContext';
import Chat from "~/context/ChatContext";

function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                <Chat>
                    {children}
                </Chat>
            </Notification>
        </>
    );
}

export default ContextContainer;