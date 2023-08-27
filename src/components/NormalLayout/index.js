import React from 'react';
import { Outlet } from 'react-router-dom';

import { Layout, theme } from 'antd';

import HeaderLayout from '~/components/HeaderLayout';

const { Content, Footer } = Layout;

function NormalLayout(props) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Layout style={{ minHeight: '90vh' }}>
                <HeaderLayout />
                <Content className="site-layout" style={{ padding: '0 50px', overflowY: 'scroll' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: '80vh',
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                        {props.children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </>
    );
}

export default NormalLayout;

/*

   <Link to="/admin">Admin</Link>
            <Logout />
            <Link to="/login">Login</Link>
            */
