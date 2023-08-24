import React, { useEffect, useState } from 'react';
import { UserOutlined, VideoCameraOutlined, BellOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Badge, Space, Avatar } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

import connectionHub from '~/api/signalr';

const { Header, Content, Footer, Sider } = Layout;

const navigationItems = [
    {
        icon: VideoCameraOutlined,
        label: 'Dash board',
        link: 'dashboard',
    },
    {
        icon: UserOutlined,
        label: 'Users',
        link: 'users',
    },
];

function AdminLayout() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const auth = useAuthUser();
    const user = auth();

    useEffect(() => {
        /*
        const getAuthToken = () => {
            // Replace this with your logic to obtain the token from the backend
            // Example: return localStorage.getItem('token');
        };
        */
        // Create a new SignalR connection with the token
        const connection = connectionHub(`notificationHub?userId=${user.id}`);
        console.log(connection);
        // Start the connection
        connection.start().catch((err) => console.error(err));

        // Receive connectionId from the server
        connection.on('ReceiveConnectionId', (data) => {
            console.log('connectionId: ' + data);
        });

        // Receive notifications from the server
        connection.on('ReceiveNotification', (message) => {
            console.log('notifi: ' + message);
            setNotifications((prevNotifications) => [...prevNotifications, message]);
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
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
                        <Badge size="small" count={5}>
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
    );
}

export default AdminLayout;
