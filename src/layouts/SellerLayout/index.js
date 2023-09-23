import React, { useState } from 'react';
import {

    UserOutlined,
    MailOutlined,
    SettingOutlined,
    // RightOutlined,
    // LeftOutlined,
    AreaChartOutlined,
    ShopOutlined

} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Space, theme, Avatar } from 'antd';
import styles from './SellerLayout.module.scss'
import classNames from 'classnames/bind';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);
const { Header, Content, Footer, Sider } = Layout;

const items = [
    {
        label: <NavLink to=''>Thống kê</NavLink>,
        key: 'dashboard',
        icon: <AreaChartOutlined />,
    },
    {
        label: 'Sản phẩm',
        key: 'product',
        icon: <ShopOutlined />,
        // disabled: true,
    },
    {
        label: 'Menu đa cấp',
        key: 'SubMenu',
        icon: <SettingOutlined />,
        children: [
            {
                type: 'group',
                label: 'Menu 1',
                children: [
                    {
                        label: 'Option 1',
                        key: 'setting:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Menu 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        icon: <MailOutlined />,
        label: (
            <NavLink to='/seller/message'>
                Tin nhắn
            </NavLink>
        ),
        key: 'seller',
    },
];
const App = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState(location.pathname.split('/').length !== 3 ? 'dashboard' : location.pathname.split('/')[2]);

    const handleClickItemSidebar = (e) => {
        setCurrent(e.key);
    };
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className={cx('container')}
        >
            <Sider theme='dark' className={cx('sidebar')}
                collapsible
                collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
            >
                <div className={cx('demo-logo-vertical')} />
                <Menu
                    style={{ fontSize: '16px' }}
                    theme='dark'
                    onClick={handleClickItemSidebar} defaultSelectedKeys={[current]} mode="inline" items={items} />
                {/* <div className='ant-layout-sider-trigger' onClick={() => setCollapsed(!collapsed)} style={{ width: `${!collapsed ? '200px' : '80px'}`, background: '#956ad6' }}>
                    {collapsed ? <RightOutlined /> : <LeftOutlined />}
                </div> */}
            </Sider>
            <Layout>
                <Header
                    className={cx('header')}
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Space size={16} style={{ display: 'flex', margin: '0 16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Avatar size='large' icon={<UserOutlined />} />
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        {location.pathname.split('/').map((value, index) => {
                            if (index !== 0) {
                                const breadItem = value.charAt(0).toUpperCase() + value.toLocaleLowerCase().slice(1)
                                return <Breadcrumb.Item key={index}>{breadItem}</Breadcrumb.Item>
                            }
                            return []
                        })}

                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    className={cx('footer')}
                >
                    ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout >
    );
};
export default App;