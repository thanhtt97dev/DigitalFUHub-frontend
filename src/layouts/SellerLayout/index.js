import React, { useState } from 'react';
import {

    AreaChartOutlined,
    StockOutlined

} from '@ant-design/icons';
import { Layout, Menu, Space, theme, Avatar } from 'antd';
import styles from './SellerLayout.module.scss'
import classNames from 'classnames/bind';
import { Link, Outlet } from 'react-router-dom';
import logo from '~/assets/images/fpt-logo.jpg'

const cx = classNames.bind(styles);
const { Content, Sider } = Layout;

const items = [
    {
        label: <Link to=''>Thống kê</Link>,
        key: 'dashboard',
        icon: <AreaChartOutlined />,
    },
    {
        label: 'Quản lý sản phẩm',
        key: 'seller/product',
        icon: <StockOutlined />,
        children: [
            {
                key: '/seller/product/list',
                label: <Link to={"/seller/product/list"}>Tất cả sản phẩm</Link>,
            },
            {
                key: '/seller/product/new',
                label: <Link to={"/seller/product/new"}>Thêm sản phẩm</Link>,
            },
            {
                key: '/seller/product/banned',
                label: <Link to={"/seller/product/banned"}>Sản phẩm vi phạm</Link>,
            },
        ],
    },
];
const SellerLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className={cx('container')}
        >
            <Sider className={cx('sidebar')}
                collapsible
                collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
                style={{ background: "#f1f1f1" }}
            >
                <div className={cx('header-logo')}>
                    <Space>
                        <Avatar src={logo} size="large" />
                        <Link to={'/home'} className={cx("link")}>
                            <h3>DigitalFUHub</h3>
                        </Link>
                    </Space>
                </div>
                <Menu
                    className={cx("menu")}
                    defaultSelectedKeys={['dashboard']}
                    mode="inline" items={items} />
            </Sider>
            <Layout>

                <Content className={cx("content")}>
                    <div
                        style={{
                            padding: 5,
                            minHeight: 650,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
};
export default SellerLayout;
