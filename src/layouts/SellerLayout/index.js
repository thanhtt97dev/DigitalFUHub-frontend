import React, { useState } from 'react';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AreaChartOutlined,
    StockOutlined,
    SettingOutlined,
    CreditCardOutlined,
    ShopOutlined,
    BellOutlined,
    MailOutlined

} from '@ant-design/icons';
import { Layout, Menu, Space, theme, Avatar, Button, Row, Col, Dropdown, Badge, Card } from 'antd';
import styles from './SellerLayout.module.scss'
import classNames from 'classnames/bind';
import { Link, Outlet } from 'react-router-dom';
import logo from '~/assets/images/fpt-logo.jpg'
import Logout from '~/components/Logout';

const cx = classNames.bind(styles);
const { Content, Sider, Header } = Layout;

const items = [

    {
        key: 'settings',
        label: <Link to={"/settings"}>Cài đặt</Link>,
        icon: <SettingOutlined />,
    },
    {
        key: 'history transaction',
        label: <Link to={"/historyTransaction"}>Lịch sử giao dịch</Link>,
        icon: <CreditCardOutlined />,
    },
    {
        key: 'logout',
        label: <Logout />,
    },
];



const menuItems = [
    {
        label: <Link to=''>Thống kê</Link>,
        key: 'dashboard',
        icon: <AreaChartOutlined className={cx('menu-icon')} />,
    },
    {
        label: 'Quản lý đơn hàng',
        key: 'seller/order',
        icon: <StockOutlined className={cx('menu-icon')} />,
        children: [
            {
                key: '/seller/order/list',
                label: <Link to={"/seller/order/list"}>Lịch sử đơn hàng</Link>,
            },
        ],
    },
    {
        label: 'Quản lý sản phẩm',
        key: 'seller/product',
        icon: <StockOutlined className={cx('menu-icon')} />,
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
    {
        label: <Link to='/seller/coupon/list'>Mã giảm giá</Link>,
        key: 'coupon',
        icon: <AreaChartOutlined className={cx('menu-icon')} />,
    },
];
const SellerLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    // const {
    //     token: { colorBgContainer },
    // } = theme.useToken();

    return (
        <Layout className={cx('container')}>
            <Sider className={cx('sider')} trigger={null} collapsible collapsed={collapsed} width={260} collapsedWidth={100}
                style={{

                }}
            >
                <div className={cx('header-logo')}>
                    <Space>
                        <Link to={'/home'} className={cx("link")}>
                            <h3>DigitalFUHub</h3>
                        </Link>
                    </Space>
                </div>
                <Menu
                    className={cx("menu")}
                    defaultSelectedKeys={['dashboard']}
                    mode="inline" items={menuItems} />
            </Sider>
            <Layout>
                <Header id='header' className={cx('header')}>
                    <Row align="middle" justify="center">
                        <Col span={2}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>

                        <Col span={22}>
                            <Row gutter={[40, 0]} justify="end" align="middle">
                                <Col >
                                    <Badge count={10} size="small">
                                        <BellOutlined style={{
                                            fontSize: '20px'
                                        }} />
                                    </Badge>
                                </Col>
                                <Col>
                                    <Badge count={12} size="small">
                                        <MailOutlined style={{
                                            fontSize: '20px',
                                        }} />
                                    </Badge>
                                </Col>
                                <Col align="center" style={{
                                    marginTop: '-0.5rem'
                                }}>
                                    <Dropdown
                                        menu={{ items }}
                                        placement="bottomRight"
                                        arrow={{
                                            pointAtCenter: true,
                                        }}
                                    >
                                        <Avatar src={logo} size="large" />
                                    </Dropdown>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Header>
                <Content className={cx('content')}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
export default SellerLayout;
