import React from 'react';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

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
                <div className="demo-logo-vertical" />
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
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, height: '600px', background: colorBgContainer }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
