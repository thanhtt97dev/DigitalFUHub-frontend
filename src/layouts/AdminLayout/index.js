import React, { useEffect, useState } from 'react';
import { UserOutlined, VideoCameraOutlined, BellOutlined, NotificationOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Badge, Space, Avatar, notification, Drawer, Empty, Alert } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

import connectionHub from '~/api/signalr/connectionHub';

import { formatTimeAgoVN } from '~/utils';

const { Header, Content, Footer, Sider } = Layout;

const navigationItems = [
    {
        icon: VideoCameraOutlined,
        label: 'Dash board',
        link: 'admin/dashboard',
    },
    {
        icon: UserOutlined,
        label: 'Users',
        link: 'admin/users',
    },
    {
        icon: NotificationOutlined,
        label: 'Notification',
        link: 'admin/notificaions',
    },
];

function AdminLayout() {
    const navigate = useNavigate();

    const [api, contextHolder] = notification.useNotification();

    const [notifications, setNotifications] = useState([]);

    const auth = useAuthUser();
    const user = auth();

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
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

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>
            {contextHolder}
            <Layout style={{ height: '100vh' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="demo-logo-vertical">
                        <img
                            src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t1.6435-9/68804899_385443322167641_2798430459044823040_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=174925&_nc_ohc=8pRShptFVFoAX_tZBDP&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfA_ZGbGImC59fphMxImb8OZkW25r2usRyzvfsCP1SaPhg&oe=6509820E"
                            alt="he"
                            style={{ width: '100%', height: 200 }}
                            onClick={() => navigate('/home')}
                        />
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={navigationItems.map((item, index) => ({
                            key: String(index + 1),
                            icon: React.createElement(item.icon),
                            label: <Link to={item.link}>{item.label}</Link>,
                        }))}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer, justifyContent: 'end' }}>
                        <Space size={30}>
                            <Badge size="small" count={5} onClick={showDrawer}>
                                <BellOutlined style={{ fontSize: 30 }} />
                            </Badge>
                            <Avatar size={38} icon={<UserOutlined />} />
                        </Space>
                    </Header>
                    <Content style={{ margin: '12px 12px 0' }}>
                        <div style={{ padding: 12, height: '600px', background: colorBgContainer }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>

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

export default AdminLayout;
