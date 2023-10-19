import React, { useEffect, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Link, useNavigate } from 'react-router-dom';
import { BellFilled, ClockCircleOutlined } from '@ant-design/icons';
import { Badge, notification, Dropdown, Menu, Empty, Alert } from 'antd';
import { editNotificationIsReaded } from "~/api/signalr/notification";
import connectionHub from '~/api/signalr/connectionHub';
import { SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION } from '~/constants';
const moment = require('moment');
require('moment/locale/vi');

function Notification() {
    const auth = useAuthUser();
    const user = auth();

    const [api, contextHolder] = notification.useNotification();

    const [notificationIsReaded, setNotificationIsReaded] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [open, setOpen] = useState(false);

    const [visibleNotifications, setVisibleNotifications] = useState(5);

    useEffect(() => {
        if (user === null || user === undefined) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`notificationHub?userId=${user.id}`);
        console.log(connection);
        // Start the connection
        connection.start().catch((err) => console.error(err));

        // Receive all notification from the server
        connection.on(SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION, (res) => {
            const notifi = JSON.parse(res);
            setNotifications((prev) => [...notifi, ...prev]);
        });

        // Receive notifications from the server
        connection.on(SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, (res) => {
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

    const loadMoreNotifications = () => {
        setVisibleNotifications((prev) => prev + 5);
    };

    const openNotificationWithIcon = (type, notifi) => {
        api[type]({
            message: notifi.Title,
            description: notifi.Message,
        });
    };

    const handleClickOpenNotification = (notifi, isReaded) => {
        if (!isReaded) {
            var currentNotification = notifications.find(x => x.NotificationId === notifi.NotificationId)
            currentNotification.IsReaded = true;

            editNotificationIsReaded(notifi.NotificationId)
                .then(res => { })
                .then(() => {
                    checkNotifications();
                });
        } else {
            checkNotifications();
        }
        setOpen(false);
    };

    const checkNotifications = () => {
        if (notifications.some((notifi) => !notifi.IsReaded)) {
            setNotificationIsReaded(false);
        } else {
            setNotificationIsReaded(true);
        }
    };

    useEffect(() => {
        if (notifications.some((notifi) => notifi.IsReaded === false)) {
            setNotificationIsReaded(false);
        } else {
            setNotificationIsReaded(true);
        }
    }, [notifications]);

    const maxHeight = window.innerHeight - 150;

    const menu = (
        <Menu style={{ width: '400px' }}>
            <div style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
                {notifications.slice(0, visibleNotifications).map((notifi, index) => (
                    <Menu.Item>
                        {notifi.IsReaded ? (
                            <Link to={notifi.Link} onClick={() => handleClickOpenNotification(notifi, true)}>
                                <Alert
                                    style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                    message={
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <p style={{ flex: 1, margin: 0 }}>{notifi.Title.length > 15 ? `${notifi.Title.slice(0, 15)}...` : notifi.Title}</p>
                                            <p style={{ fontSize: 10, margin: 0 }}>{moment(notifi.DateCreated).fromNow()}</p>
                                        </span>
                                    }
                                    description={<p>{notifi.Content.length > 60 ? `${notifi.Content.slice(0, 60)}...` : notifi.Content}</p>}
                                    type="info"
                                />
                            </Link>
                        ) : (
                            <Link to={notifi.Link} onClick={() => handleClickOpenNotification(notifi, false)}>
                                <Alert
                                    style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                    message={
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <b style={{ flex: 1, margin: 0 }}>{notifi.Title.length > 15 ? `${notifi.Title.slice(0, 15)}...` : notifi.Content}</b>
                                            <b style={{ fontSize: 10, margin: '0 4px', color: 'blue' }}>{moment(notifi.DateCreated).fromNow()}</b>
                                            <div style={{ backgroundColor: 'blue', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px' }} />
                                        </span>
                                    }
                                    description={<b>{notifi.Content.length > 60 ? `${notifi.Content.slice(0, 60)}...` : notifi.Content}</b>}
                                    type="info"
                                />
                            </Link>
                        )}
                    </Menu.Item>
                ))}
            </div>
            {notifications.length > visibleNotifications && (
                <Menu.Item style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <a onClick={loadMoreNotifications}>Xem thêm</a>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <>
            {contextHolder}
            <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
                open={open}
                onOpenChange={(visible) => setOpen(visible)}
            >
                <Badge
                    size="small"
                    count={notificationIsReaded ? 0 : <ClockCircleOutlined style={{ paddingTop: '30px', color: '#f5222d' }} />}
                >
                    <BellFilled style={{ fontSize: '25px', paddingTop: '20px' }} />
                </Badge>
            </Dropdown>
        </>
    );
}

export default Notification;