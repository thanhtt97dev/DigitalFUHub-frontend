import React, { useEffect, useState, useContext } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Alert, Button, Space, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import {
    editNotificationIsReaded,
    editReadAllNotifications,
    fetchMoreNotifications,
    getNumberNotificationUnRead
} from '~/api/signalr/notification';

import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE_NOTIFICATION
} from "~/constants";
import moment from 'moment';
import 'moment/locale/vi';


import { NotificationContext } from "~/context/SignalR/NotificationContext";

function Notification() {

    const navigate = useNavigate();

    const [api, contextHolder] = notification.useNotification()

    const openNotificationWithIcon = (type = 'success', description = '', message = "", onClick, duration = 5, placement = 'bottomLeft') => {
        api[type]({
            message: message,
            description: description,
            duration: duration,
            placement: placement,
            onClick: onClick
        });
    };


    // get context
    const notificationContext = useContext(NotificationContext);

    // get data cookie
    const auth = useAuthUser();
    const user = auth();

    // variables
    const [openNotification, setOpenNotification] = useState(false)
    const [notifications, setNotifications] = useState([]);
    const [totalNotification, setTotalNotification] = useState(PAGE_SIZE_NOTIFICATION);
    const [totalNotificationUnRead, setTotalNotificationUnRead] = useState(0)
    const [paramSearch, setParamSearch] = useState({
        userId: user.id,
        index: 0
    });


    //mounted
    useEffect(() => {
        fetchMoreNotifications(paramSearch)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    var data = res.data.result;
                    setNotifications((prev) => [...data.notifications, ...prev])
                    setTotalNotification(data.totalNotification)
                }
            });
        getNumberNotificationUnRead(user.id).then((res) => {
            if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                setTotalNotificationUnRead(res.data.result)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (notificationContext === null || notificationContext === undefined || notificationContext === "") return;
        var notifi = {
            notificationId: notificationContext.NotificationId,
            content: notificationContext.Content,
            dateCreated: notificationContext.DateCreated,
            isReaded: notificationContext.IsReaded,
            link: notificationContext.Link,
            title: notificationContext.Title,
        }
        setNotifications((prev) => [notifi, ...prev]
        )
        setTotalNotificationUnRead(totalNotificationUnRead + 1)
        openNotificationWithIcon("info", notifi.content, notifi.title, () => handleOpenNotification(notifi))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationContext])


    const handleLoadMore = () => {
        fetchMoreNotifications(paramSearch)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const data = res.data.result;
                    setNotifications((prev) => [...prev, ...data.notifications])
                    setTotalNotification(data.totalNotification)
                    setParamSearch({
                        ...paramSearch,
                        index: notifications.length,
                    });
                }
            });

    };

    const handleOpenNotification = (notifi) => {
        if (!notifi.isReaded) {
            notifications.find((x) => x.NotificationId === notifi.notificationId);
            setNotifications(
                notifications.map(item => {
                    if (item.notificationId === notifi.notificationId) {
                        return { ...item, isReaded: true }
                    } else {
                        return item
                    }
                })
            )
            editNotificationIsReaded(notifi.notificationId)
                .then((res) => {

                })
        }
        navigate(notifi.link)
        setOpenNotification(false)
    };

    const handleReadAllNotifications = () => {
        setNotifications(
            notifications.map(item => {
                return { ...item, isReaded: true }
            })
        )
        setTotalNotificationUnRead(0)
        editReadAllNotifications(user.id)
            .then((res) => { })
    };


    return (
        <>
            {contextHolder}
            {notifications ?
                <Dropdown
                    overlay={
                        <>
                            <Space style={{ backgroundColor: 'white', width: '400px', padding: '10px 0' }}>
                                <h2 style={{ marginLeft: '10px' }}>Thông báo</h2>
                                <Button onClick={handleReadAllNotifications} type="link" style={{ position: "absolute", left: "260px", top: "10px" }}>Đánh dấu đã đọc</Button>
                            </Space>
                            {notifications.length > 0 ?
                                <Menu style={{ width: '400px' }}>
                                    <div style={{ minHeight: '200px', maxHeight: "500px", overflowY: 'auto' }}>
                                        {notifications.map((item, index) => {
                                            return (
                                                <Menu.Item key={index}>
                                                    <Alert
                                                        style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                                        message={
                                                            item.isReaded ? (
                                                                <div onClick={() => handleOpenNotification(item)}>
                                                                    <Alert
                                                                        style={{ backgroundColor: 'white', width: '100%', height: '20', border: 'none' }}
                                                                        message={
                                                                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <b style={{ flex: 1, margin: 0 }}>{item.title}</b>
                                                                                <span style={{ fontSize: 10, margin: '0 4px', color: 'blue' }}>{moment(item.dateCreated).fromNow()}</span>
                                                                            </p>
                                                                        }
                                                                        description={<p>{item.content}</p>}
                                                                        type="info"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div onClick={() => handleOpenNotification(item)}>
                                                                    <Alert
                                                                        style={{ backgroundColor: 'white', width: '100%', minHeight: '100px', border: 'none' }}
                                                                        message={
                                                                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <b style={{ flex: 1, margin: 0 }}>{item.title}</b>
                                                                                <p style={{ fontSize: 10, margin: '0 4px', color: 'blue' }}>{moment(item.dateCreated).fromNow()}</p>
                                                                                <FontAwesomeIcon icon={faCircle} style={{ color: "#0866ff", position: "absolute", top: "55px", left: "320px" }} />
                                                                            </p>
                                                                        }
                                                                        description={<b>{item.content}</b>}
                                                                        type="info"
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    />
                                                </Menu.Item>
                                            )
                                        })}
                                    </div>

                                    <Menu.Item
                                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                                    >
                                        {notifications.length < totalNotification ?
                                            <Button onClick={handleLoadMore}>
                                                Xem thêm
                                            </Button>
                                            :
                                            <></>
                                        }
                                    </Menu.Item>
                                </Menu>
                                :
                                <></>
                            }
                        </>
                    }
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                    open={openNotification}
                    onOpenChange={(visible) => {
                        setOpenNotification(visible)
                        setTotalNotificationUnRead(0)
                    }}
                >
                    <Badge
                        size="small"
                        count={totalNotificationUnRead}
                    >
                        <BellOutlined style={{ fontSize: '25px', cursor: 'pointer' }} />
                    </Badge>
                </Dropdown>
                :
                <></>
            }
        </>
    );


}

export default Notification;
