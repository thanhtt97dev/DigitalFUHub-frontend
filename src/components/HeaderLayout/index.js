import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { Layout, Image, Space, Button, Dropdown } from 'antd';

import Logout from '~/components/Logout';
import Notificaion from '~/components/Notification';
import { ReportUserInfo } from '~/components/Report'

import logo from '~/assets/images/Logo.png';
import logoFPT from '~/assets/images/fpt-logo.jpg';
import { ADMIN_ROLE, USER_ROLE } from '~/constants';

const { Header } = Layout;

const itemsFixed = [
    {
        key: 'admin',
        label: <Link to={"/admin"}>Admin</Link>,
        role: ADMIN_ROLE
    },
    {
        key: 'settings',
        label: <Link to={"/settings"}>Profile</Link>,
        role: USER_ROLE
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

    useLayoutEffect(() => {
        var itemsCanAccses = itemsFixed;
        if (user === null) {
            itemsCanAccses = itemsFixed.filter(x => x.role === undefined);
        }
        if (user.roleName === USER_ROLE) {
            itemsCanAccses = itemsFixed.filter(x => x.role !== ADMIN_ROLE);
        }
        setItems(itemsCanAccses);
        return () => {
            setItems([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


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
                    <Link to={'/upload'}>
                        <Button type="primary">Upload</Button>
                    </Link>
                    {user === null ? (
                        <Space>
                            <Link to={'/register'}>
                                <Button type="primary">Register</Button>
                            </Link>
                            <Link to={'/Login'}>
                                <Button type="primary">Login</Button>
                            </Link>
                        </Space>
                    ) : (
                        <>
                            <ReportUserInfo />
                            <Notificaion />
                            <Dropdown menu={{ items }} placement="bottom">
                                <img
                                    style={{
                                        borderRadius: '50%',
                                        width: '50px',
                                        marginRight: '20px',
                                        marginTop: '20px',
                                    }}
                                    alt=""
                                    src={logoFPT}
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
