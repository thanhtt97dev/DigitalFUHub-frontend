import React, { useEffect, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Link, useNavigate } from 'react-router-dom';
import { BellFilled, ClockCircleOutlined } from '@ant-design/icons';
import { Badge, notification, Drawer, Empty, Alert } from 'antd';
import { editNotificationIsReaded } from "~/api/signalr/notification";
import connectionHub from '~/api/signalr/connectionHub';
import { SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION } from '~/constants';
const moment = require('moment');
require('moment/locale/vi');

function Notification() {
    const auth = useAuthUser();
    const user = auth();

    const [api, contextHolder] = notification.useNotification();

    const [notificationIsReaded, setNotificationIsReaded] = useState([]);

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
        }
        setOpen(false)
    };

    useEffect(() => {
        if (notifications.some((notifi) => notifi.IsReaded === false)) {
            setNotificationIsReaded(false);
        } else {
            setNotificationIsReaded(true);
        }
    }, [notifications]);

    return (
        <>
            {contextHolder}
            <Badge size="small" count={notificationIsReaded ? 0 : <ClockCircleOutlined style={{ paddingTop: '30px', color: '#f5222d' }} />} onClick={showDrawer}>
                <BellFilled style={{ fontSize: '25px', paddingTop: '20px' }} />
            </Badge>
            <Drawer
                style={{ overflowY: 'scroll', backgroundColor: '#F3F4F6' }}
                title="Thông báo"
                placement="right"
                onClose={onClose}
                open={open}
            >
                {notifications.length !== 0 ? (
                    notifications.map((notifi, index) => {
                        return (
                            <>
                                {notifi.IsReaded ? (
                                    <Link to={notifi.Link} onClick={() => handleClickOpenNotification(notifi, true)}>
                                        <Alert
                                            style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                            message={
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <b style={{ flex: 1, margin: 0 }}>{notifi.Title.length > 15 ? `${notifi.Title.slice(0, 15)}...` : notifi.Title}</b>
                                                    <p style={{ fontSize: 10, margin: 0 }}>{moment(notifi.DateCreated).fromNow()}</p>
                                                </span>
                                            }
                                            description={<p>{notifi.Content.length > 60 ? `${notifi.Content.slice(0, 60)}...` : notifi.Content}</p>}
                                            type="info"
                                        />
                                    </Link >
                                ) : (
                                    <Link to={notifi.Link} key={index} onClick={() => handleClickOpenNotification(notifi, false)} >
                                        <Alert
                                            style={{ width: '100%', height: '20', border: 'none' }}
                                            message={
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <b style={{ flex: 1, margin: 0 }}>{notifi.Title.length > 15 ? `${notifi.Title.slice(0, 15)}...` : notifi.Content}</b>
                                                    <b style={{ fontSize: 10, margin: 0, color: 'blue' }}>{moment(notifi.DateCreated).fromNow()}</b>
                                                </span>
                                            }
                                            description={<p>{notifi.Content.length > 60 ? `${notifi.Content.slice(0, 60)}...` : notifi.Content}</p>}
                                            type="info"
                                        />
                                    </Link>
                                )}
                            </>
                        );
                    })
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Drawer >
        </>
    );
}

export default Notification;
