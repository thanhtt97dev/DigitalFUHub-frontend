import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Link } from 'react-router-dom';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Alert, Button, Space } from 'antd';
import { editNotificationIsReaded, editReadAllNotifications, fetchMoreNotifications } from '~/api/signalr/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import moment from 'moment';
import 'moment/locale/vi';


import { NotificationContext } from "~/context/SignalR/NotificationContext";

function NotificationContent({
    notifications,
    handleClickReadAllNotifications,
    handleClickOpenNotification,
    visibleNotifications,
    loadMoreNotifications,
    loadingMore,
    maxHeight
}) {
    return (
        <>
            <Space style={{ backgroundColor: 'white', width: '400px', padding: '10px 0' }}>
                <h2 style={{ marginLeft: '10px' }}>Thông báo</h2>
                <Button onClick={handleClickReadAllNotifications} type="link" style={{ position: "absolute", left: "260px", top: "10px" }}>Đánh dấu đã đọc</Button>
            </Space>
            {notifications.length > 0 ?
                <Menu style={{ width: '400px' }}>
                    <div style={{ minHeight: 'auto', maxHeight: maxHeight, overflowY: 'auto' }}>
                        {notifications.map((item) => {
                            return (
                                <Menu.Item key={item.itemcationId}>
                                    {item.IsReaded ? (
                                        <Link to={item.link} onClick={() => handleClickOpenNotification(item, true)}>
                                            <Alert
                                                style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                                message={
                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <p>{item.title}</p>
                                                        <p>{moment(item.dateCreated).fromNow()}</p>
                                                        {/* <p style={{ flex: 1, margin: 0 }}>{item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title}</p>
                                                        <p style={{ fontSize: 10, margin: 0 }}>{moment(item.dateCreated).fromNow()}</p> */}
                                                    </span>
                                                }
                                                // description={<p>{item.content.length > 80 ? `${item.Content.slice(0, 80)}...` : item.content}</p>}
                                                description={<b>{item.content}</b>}
                                                type="info"
                                            />
                                        </Link>
                                    ) : (
                                        <Link to={item.link} onClick={() => handleClickOpenNotification(item, false)}>
                                            <Alert
                                                style={{ backgroundColor: 'white', width: '100%', minHeight: '100px', border: 'none' }}
                                                message={
                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        {/* <b style={{ flex: 1, margin: 0 }}>{item.title.length > 15 ? `${item.title.slice(0, 20)}...` : item.content}</b>
                                                        <b style={{ fontSize: 10, margin: '0 4px', color: 'blue' }}>{moment(item.dateCreated).fromNow()}</b> */}
                                                        <p>{item.title}</p>
                                                        <p>{moment(item.dateCreated).fromNow()}</p>
                                                        <FontAwesomeIcon icon={faCircle} style={{ color: "#0866ff", position: "absolute", top: "55px", left: "330px" }} />
                                                    </span>
                                                }
                                                // description={<b>{item.Content.length > 80 ? `${item.Content.slice(0, 80)}...` : item.Content}</b>}
                                                description={<b>{item.content}</b>}
                                                type="info"
                                            />
                                        </Link>
                                    )}
                                </Menu.Item>
                            )
                        })}
                    </div>
                    {notifications.length >= visibleNotifications && (
                        <Menu.Item style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <Button onClick={loadMoreNotifications} disabled={loadingMore}>
                                {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                            </Button>
                        </Menu.Item>
                    )}
                </Menu>
                :
                <></>
            }

        </>
    );
}

function Notification() {

    // get context
    const notification = useContext(NotificationContext);

    const auth = useAuthUser();
    const user = auth();
    const maxHeight = window.innerHeight - 250;


    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState([...notifications]);
    const [open, setOpen] = useState(false);
    const [visibleNotifications, setVisibleNotifications] = useState(5);
    const [loadingMore, setLoadingMore] = useState(false);
    const [paramSearch, setParamSearch] = useState({
        userId: user.id,
        limit: 5,
        offset: 5,
    });


    //mounted
    useLayoutEffect(() => {
        setLoadingMore(true);
        fetchMoreNotifications(paramSearch)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const notifi = res.data.result;
                    setNotifications((prev) => [...prev, ...notifi]);
                }
            });
        setLoadingMore(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        setNotifications((prev) => [notification, ...prev])
    }, [notification])

    // recevie new notifications
    useLayoutEffect(() => {
        setNewNotifications(notifications);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newNotifications]);

    //handel render notification recevied
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifications]);


    const loadMoreNotifications = () => {
        setLoadingMore(true);
        fetchMoreNotifications(paramSearch)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const notifi = res.data.result;
                    setNotifications((prev) => [...prev, ...notifi]);
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

    const handleClickOpenNotification = (notifi, isReaded) => {
        if (!isReaded) {
            const currentNotification = notifications.find((x) => x.NotificationId === notifi.NotificationId);
            currentNotification.IsReaded = true;

            editNotificationIsReaded(notifi.NotificationId)
                .then((res) => { })
                .then(() => {
                });
        } else {
        }
        setOpen(false);
    };

    const handleClickReadAllNotifications = () => {
        editReadAllNotifications(user.id)
            .then((res) => { })
        setOpen(false);
    };



    return (
        <>
            {notifications ?
                <Dropdown
                    overlay={
                        <NotificationContent
                            notifications={notifications}
                            handleClickReadAllNotifications={handleClickReadAllNotifications}
                            handleClickOpenNotification={handleClickOpenNotification}
                            visibleNotifications={visibleNotifications}
                            loadMoreNotifications={loadMoreNotifications}
                            loadingMore={loadingMore}
                            maxHeight={maxHeight}
                        />
                    }
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                    open={open}
                    onOpenChange={(visible) => setOpen(visible)}
                >
                    <Badge
                        size="small"
                    >
                        <BellOutlined style={{ fontSize: '25px', paddingTop: '20px', cursor: 'pointer' }} />
                    </Badge>
                </Dropdown>
                :
                <></>
            }
        </>
    );
}

export default Notification;
