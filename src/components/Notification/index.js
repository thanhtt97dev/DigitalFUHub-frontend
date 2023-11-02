import React, { useEffect, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Link } from 'react-router-dom';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Badge, notification, Dropdown, Menu, Alert, Button, Space } from 'antd';
import { editNotificationIsReaded, editReadAllNotifications, fetchMoreNotifications } from '~/api/signalr/notification';
import connectionHub from '~/api/signalr/connectionHub';
import { SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION } from '~/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import moment from 'moment';
import 'moment/locale/vi';

function Notification() {
    const auth = useAuthUser();
    const user = auth();
    const maxHeight = window.innerHeight - 250;

    const [api, contextHolder] = notification.useNotification();

    const [notificationIsReaded, setNotificationIsReaded] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState([notifications]);
    const [open, setOpen] = useState(false);
    const [visibleNotifications, setVisibleNotifications] = useState(5);
    const [loadingMore, setLoadingMore] = useState(false);
    const [paramSearch, setParamSearch] = useState({
        userId: user.id,
        limit: 5,
        offset: 5,
    });

    useEffect(() => {
        if (user === null || user === undefined) return;

        const connection = connectionHub(`hubs/notification?userId=${user.id}`);
        connection.start().catch((err) => console.error(err));

        connection.on(SIGNAL_R_NOTIFICATION_HUB_RECEIVE_ALL_NOTIFICATION, (res) => {
            const notifi = JSON.parse(res);
            setNotifications((prev) => [...notifi, ...prev]);
            setNewNotifications((prev) => [...notifi, ...prev]);
        });

        connection.on(SIGNAL_R_NOTIFICATION_HUB_RECEIVE_NOTIFICATION, (res) => {
            const notifi = JSON.parse(res);
            openNotificationWithIcon('info', notifi);
            setNotifications((prev) => [notifi, ...prev]);
        });

        return () => {
            connection.stop();
        };
    }, []);

    const loadMoreNotifications = () => {
        setLoadingMore(true);

        fetchMoreNotifications(paramSearch)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const notifi = JSON.parse(res.data.result);
                    setNotifications([...notifications, ...notifi]);
                    setParamSearch({
                        ...paramSearch,
                        offset: visibleNotifications,
                    });
                    setVisibleNotifications((prev) => prev + 5);
                }
            });

        setLoadingMore(false);
        setNewNotifications([notifications]);
    };

    useEffect(() => {
        setNewNotifications(notifications);
    }, [newNotifications]);

    const openNotificationWithIcon = (type, notifi) => {
        api[type]({
            message: notifi.Title,
            description: notifi.Message,
        });
    };

    const handleClickOpenNotification = (notifi, isReaded) => {
        if (!isReaded) {
            const currentNotification = notifications.find((x) => x.NotificationId === notifi.NotificationId);
            currentNotification.IsReaded = true;

            editNotificationIsReaded(notifi.NotificationId)
                .then((res) => { })
                .then(() => {
                    checkNotifications();
                });
        } else {
            checkNotifications();
        }
        setOpen(false);
    };

    const handleClickReadAllNotifications = () => {
        editReadAllNotifications(user.id)
            .then((res) => { })
            .then(() => {
                checkNotifications();
            });
        setOpen(false);
    };

    const checkNotifications = () => {
        const hasUnreadNotifications = notifications.some((notifi) => !notifi.IsReaded);
        setNotificationIsReaded(!hasUnreadNotifications);
    };

    useEffect(() => {
        checkNotifications();
    }, [notifications]);

    const menu = (
        <>
            <Space style={{ backgroundColor: 'white', width: '400px', padding: '10px 0' }}>
                <h2 style={{ marginLeft: '10px' }}>Thông báo</h2>
                <Button onClick={handleClickReadAllNotifications} type="link" style={{ position: "absolute", left: "260px", top: "10px" }}>Đánh dấu đã đọc</Button>
            </Space>
            <Menu style={{ width: '400px' }}>
                <div style={{ minHeight: 'auto', maxHeight: maxHeight, overflowY: 'auto' }}>
                    {notifications.map(notifi => (
                        <Menu.Item key={notifi.NotificationId}>
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
                                        description={<p>{notifi.Content.length > 80 ? `${notifi.Content.slice(0, 80)}...` : notifi.Content}</p>}
                                        type="info"
                                    />
                                </Link>
                            ) : (
                                <Link to={notifi.Link} onClick={() => handleClickOpenNotification(notifi, false)}>
                                    <Alert
                                        style={{ backgroundColor: 'white', width: '100%', minHeight: '100px', border: 'none' }}
                                        message={
                                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <b style={{ flex: 1, margin: 0 }}>{notifi.Title.length > 15 ? `${notifi.Title.slice(0, 20)}...` : notifi.Content}</b>
                                                <b style={{ fontSize: 10, margin: '0 4px', color: 'blue' }}>{moment(notifi.DateCreated).fromNow()}</b>
                                                <FontAwesomeIcon icon={faCircle} style={{ color: "#0866ff", position: "absolute", top: "55px", left: "330px" }} />
                                            </span>
                                        }
                                        description={<b>{notifi.Content.length > 80 ? `${notifi.Content.slice(0, 80)}...` : notifi.Content}</b>}
                                        type="info"
                                    />
                                </Link>
                            )}
                        </Menu.Item>
                    ))}
                </div>
                {notifications.length >= visibleNotifications && (
                    <Menu.Item style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        <Button onClick={loadMoreNotifications} disabled={loadingMore}>
                            {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                        </Button>
                    </Menu.Item>
                )}
            </Menu>
        </>
    );

    return (
        <>
            {contextHolder}
            <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
                open={open}
                onOpenChange={(visible) => setOpen(visible)}
            >
                <Badge
                    size="small"
                    count={notificationIsReaded ? 0 : <ClockCircleOutlined style={{ paddingTop: '30px', color: '#f5222d' }} />}
                >
                    <BellOutlined style={{ fontSize: '25px', paddingTop: '20px', cursor: 'pointer' }} />
                </Badge>
            </Dropdown>
        </>
    );
}

export default Notification;
