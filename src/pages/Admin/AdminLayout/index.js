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
                <div className="demo-logo-vertical">
                    <img
                        src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t1.6435-9/68804899_385443322167641_2798430459044823040_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=174925&_nc_ohc=8pRShptFVFoAX_tZBDP&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfA_ZGbGImC59fphMxImb8OZkW25r2usRyzvfsCP1SaPhg&oe=6509820E"
                        alt="he"
                        style={{ width: '100%', height: 200 }}
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
                <Header style={{ padding: 0, background: colorBgContainer }} />
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
