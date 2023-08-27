import React, { useEffect, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { BellFilled } from '@ant-design/icons';
import { Badge, notification, Drawer, Empty, Alert } from 'antd';
import { formatTimeAgoVN } from '~/utils';
import connectionHub from '~/api/signalr/connectionHub';

function Notification() {
    const auth = useAuthUser();
    const user = auth();

    const [api, contextHolder] = notification.useNotification();

    const [notifications, setNotifications] = useState([]);

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (user === null || user === undefined) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`notificationHub?userId=${user.id}`);
        console.log(connection);
        // Start the connection
        connection.start().catch((err) => console.error(err));

        // Receive all notification from the server
        connection.on('ReceiveAllNotification', (res) => {
            const notifi = JSON.parse(res);
            setNotifications((prev) => [...notifi, ...prev]);
        });

        // Receive notifications from the server
        connection.on('ReceiveNotification', (res) => {
            const notifi = JSON.parse(res);
            openNotificationWithIcon('info', notifi);
            setNotifications((prev) => [notifi, ...prev]);
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openNotificationWithIcon = (type, notifi) => {
        api[type]({
            message: notifi.Title,
            description: notifi.Message,
        });
    };

    return (
        <>
            {contextHolder}
            <Badge size="small" count={notifications.length} onClick={showDrawer}>
                <BellFilled style={{ fontSize: 30 }} />
            </Badge>
            <Drawer
                style={{ overflowY: 'scroll' }}
                title="Notification"
                placement="right"
                onClose={onClose}
                open={open}
            >
                {notifications.length !== 0 ? (
                    notifications.map((notifi, index) => {
                        return (
                            <Alert
                                key={index}
                                style={{ marginBottom: 20 }}
                                message={<span style={{ fontWeight: 'bold' }}>{notifi.Title}</span>}
                                description={
                                    <>
                                        <p>{notifi.Content}</p>
                                        <p style={{ fontSize: 10 }}>{formatTimeAgoVN(notifi.DateCreated)}</p>
                                    </>
                                }
                                type="info"
                                showIcon
                            />
                        );
                    })
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Drawer>
        </>
    );
}

export default Notification;
