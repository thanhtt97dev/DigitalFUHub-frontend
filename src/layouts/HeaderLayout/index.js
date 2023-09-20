import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { Layout, Image, Space, Button, Dropdown } from 'antd';

import Logout from '~/components/Logout';
import Notificaion from '~/components/Notification';
import { MessageOutlined } from '@ant-design/icons';

import logo from '~/assets/images/Logo.png';
import logoFPT from '~/assets/images/fpt-logo.jpg';
import { ADMIN_ROLE, CUSTOMER_ROLE } from '~/constants';
import ModalRequestDeposit from '../../components/Modals/ModalRequestDeposit';
import AccountBalance from '../../components/AccountBalance';

const { Header } = Layout;

const itemsFixed = [
    {
        key: 'settings',
        label: <Link to={"/settings"}>Cài đặt</Link>,
        role: CUSTOMER_ROLE
    },
    {
        key: 'logout',
        label: <Logout />,
    },
];

function HeaderLayout() {

    const auth = useAuthUser();
    const user = auth();

    const [items, setItems] = useState([]);
    const [userAvatart, setUserAvatart] = useState(null);

    useEffect(() => {

        var itemsCanAccses = itemsFixed;
        if (user === null) return;
        if (user.roleName === undefined) {
            itemsCanAccses = itemsFixed.filter(x => x.role === undefined);
        } else {
            if (user.roleName === CUSTOMER_ROLE) {
                itemsCanAccses = itemsFixed.filter(x => x.role !== ADMIN_ROLE);
            }
            if (user.roleName === ADMIN_ROLE) {
                itemsCanAccses = itemsFixed.filter(x => x.role !== CUSTOMER_ROLE);
            }
        }
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
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#dfe1e3',
                    justifyContent: 'space-between',
                }}
            >
                <Space>
                    <Image width={60} src={logo} />
                    <Link to={'/home'}>
                        <h5>MelodyMix</h5>
                    </Link>
                    <Link to={"/accessdenied"}>test</Link>
                </Space>


                <Space size={12}>
                    {user === null ? (
                        <Space>
                            <Link to={'/signup'}>
                                <Button type="primary">SignUp</Button>
                            </Link>
                            <Link to={'/Login'}>
                                <Button type="primary">Login</Button>
                            </Link>
                        </Space>
                    ) : (
                        <>
                            <AccountBalance />
                            <ModalRequestDeposit userId={user.id} />
                            <Notificaion />
                            <Link to={'/chatBox'}>
                                <MessageOutlined style={{ fontSize: '20px' }} />
                            </Link>
                            <Dropdown menu={{ items }} placement="bottom">
                                <img
                                    style={{
                                        borderRadius: '50%',
                                        width: '50px',
                                        marginRight: '20px',
                                        marginTop: '20px',
                                    }}
                                    alt=""
                                    src={userAvatart}
                                />
                            </Dropdown>
                        </>
                    )}
                </Space>
            </Header>
        </>
    );
}

export default HeaderLayout;
