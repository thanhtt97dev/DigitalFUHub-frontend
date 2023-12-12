import Notification from '~/context/UI/NotificationContext';

import SignalR from '../SignalR';

function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                <SignalR>
                    {children}
                </SignalR>
            </Notification>
        </>
    );
}

export default ContextContainer;