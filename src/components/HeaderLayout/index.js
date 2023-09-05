import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Layout, Image, Space, Button, Dropdown } from 'antd';
import Logout from '~/components/Logout';

import logo from '~/assets/images/Logo.png';
import { useAuthUser } from 'react-auth-kit';
import { ADMIN_ROLE } from '~/constants';

import Notificaion from '~/components/Notification';
import { postUserExport } from '~/api/user'
import { saveAs } from 'file-saver'
import ModelDefault from '../Modal';

const { Header } = Layout;

const itemsFixed = [
    {
        key: 'logout',
        label: <Logout />,
    },
];

function HeaderLayout() {
    //Modal
    const [openModal, setOpenModel] = useState(false)
    const handleOpenModal = () => {
        setOpenModel(!openModal)
    }


    const auth = useAuthUser();
    const user = auth();

    //Demo export
    const handleExport = () => {
        postUserExport({ id: 1 })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, "export_user.xlsx")
            })
    }
    //



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

    const dataModal = {
        title: "Export file excel",
        content: "Do you want to export to excel file?",
        handleOpenModal,
        openModal,
        action: handleExport,
    }

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
                <Space>
                    <Button type="primary" onClick={handleOpenModal}>Export</Button>
                </Space>
                <Space>
                    <Link to={'/register'}>
                        <Button type="primary">Register</Button>
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
                                    src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/327186771_897523861694243_5094115961239590668_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Rw_HeVuEIvcAX-dDucE&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfDws4iBbYFY0b5kmChNdyLnKpqspYVtv-vjCNeoPseE6g&oe=64F08780"
                                />
                            </Dropdown>
                        </>
                    )}
                </Space>
            </Header>
            <ModelDefault data={dataModal} />
        </>
    );
}

export default HeaderLayout;
