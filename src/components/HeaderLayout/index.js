import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Layout, Image, Space, Button, Dropdown } from 'antd';
import Logout from '~/components/Logout';

import logo from '~/assets/images/Logo.png';
import { useAuthUser } from 'react-auth-kit';
import { ADMIN_ROLE } from '~/constants';

import Notificaion from '~/components/Notification';

const { Header } = Layout;

const itemsFixed = [
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
        setItems(itemsFixed);
        if (user === null) return;
        if (user.roleName === ADMIN_ROLE) {
            const item = {
                key: 'admin',
                label: (
                    <Link to="/admin">
                        <Button>Admin</Button>
                    </Link>
                ),
            };
            setItems((prev) => [item, ...prev]);
        }
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
                    <Link to={'/Home'}>
                        <h5>MelodyMix</h5>
                    </Link>
                </Space>
                <Space size={12}>
                    {user === null ? (
                        <Link to={'/Login'}>
                            <Button type="primary">Login</Button>
                        </Link>
                    ) : (
                        <>
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
                                    src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/340617253_756857036006843_1695725732570396065_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=174925&_nc_ohc=a6-W6Abaw5YAX8BbDZd&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfAPc9UT-ApACAaCMdkFPSXwMKoNA-mEc4hrW8FfSZHcpw&oe=64EF430A"
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
