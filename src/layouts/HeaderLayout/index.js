import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { Layout, Image, Space, Button, Dropdown, Avatar } from 'antd';
import Logout from '~/components/Logout';
import Notificaion from '~/components/Notification';
import {
    MessageOutlined, ShoppingCartOutlined, MessageFilled, BellFilled,
    SettingOutlined, CreditCardOutlined, ShopOutlined
} from '@ant-design/icons';

import logo from '~/assets/images/Logo.png';
import logoFPT from '~/assets/images/fpt-logo.jpg';
import { CUSTOMER_ROLE, SELLER_ROLE } from '~/constants';
import ModalRequestDeposit from '../../components/Modals/ModalRequestDeposit';
import AccountBalance from '../../components/AccountBalance';

import classNames from 'classnames/bind';
import styles from './HeaderLayout.module.scss';

const cx = classNames.bind(styles);

const { Header } = Layout;

const itemsFixed = [
    {
        key: 'settings',
        label: <Link to={"/settings"}><><SettingOutlined /> Cài đặt</></Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'history transaction',
        label: <Link to={"/historyTransaction"}><CreditCardOutlined /> Lịch sử giao dịch</Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'registerSeller',
        label: <Link to={"/settings/registerSeller"}><ShopOutlined /> Đăng ký bán hàng</Link>,
        roles: [CUSTOMER_ROLE]
    },
    {
        key: 'seller',
        label: <Link to={"/seller"}><ShopOutlined /> Kênh người bán</Link>,
        roles: [SELLER_ROLE]
    },
    {
        key: 'logout',
        label: <Logout />,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
];


function HeaderLayout() {

    const auth = useAuthUser();
    const user = auth();

    const [items, setItems] = useState([]);
    const [userAvatart, setUserAvatart] = useState(null);

    useEffect(() => {

        var itemsCanAccses = itemsFixed;
        if (user === null || user === undefined) return;
        itemsCanAccses = itemsFixed.filter(x => x.roles.includes(user.roleName));
        setItems(itemsCanAccses);
        return () => {
            setItems([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (user !== null) {
            if (user.avatar === undefined || user.avatar === "") {
                setUserAvatart(logoFPT)
            } else {
                setUserAvatart(user.avatar)
            }
        }
    }, [user])


    return (
        <>
            <Header className={cx("header")}>
                <Space>
                    <Image width={60} src={logo} />
                    <Link to={'/home'} className={cx("link")}>
                        <h3>DigitalFUHub</h3>
                    </Link>
                </Space>

                <Space size={12}>
                    {user === null ? (
                        <>
                            <Space>
                                <BellFilled className={cx("icon")} />
                                <Link to={'/Login'}>
                                    <Button type="primary" className={cx("button")}>Đăng nhập</Button>
                                </Link>
                                <Link to={'/signup'}>
                                    <Button type="primary" className={cx("button")}>Đăng ký</Button>
                                </Link>
                            </Space>
                        </>
                    ) : (
                        <>
                            <AccountBalance />
                            <ModalRequestDeposit userId={user.id} style={{ background: 'black' }} />
                            <Link to={'/cart'}>
                                <Button type="primary" className={cx("button")} icon={<ShoppingCartOutlined />}>Giỏ hàng</Button>
                            </Link>

                            <Notificaion />
                            <Link to={'/chatBox'}>
                                <MessageFilled className={cx("icon")} />
                            </Link>
                            <Dropdown
                                menu={{ items }}
                                placement="bottomRight"
                                arrow={{
                                    pointAtCenter: true,
                                }}
                            >
                                <Avatar size={50} src={userAvatart} />
                            </Dropdown>
                        </>
                    )}
                </Space>
            </Header>
        </>
    );
}

export default HeaderLayout;
