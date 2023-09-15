import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin, Modal } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { useSignIn } from 'react-auth-kit';

import { login } from '~/api/user';
import { saveDataAuthToCookies, removeDataAuthInCookies, getUser } from '~/utils';
import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES, GOOGLE_CLIENT_ID } from '~/constants';
import GoogleSignIn from '~/components/GoogleSignIn';
//import { ADMIN_ROLE, User_ROLE } from "~/constants"

function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    let [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const loadingIcon = (
        <LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />
    )

    const user = getUser();
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        // checking user was logined (with data auth in cookie)
        if (user !== undefined) {
            setModalOpen(true);
        }
    }, [user])

    // handle remove auth data in cookie
    const onModalOk = () => {
        removeDataAuthInCookies();
        setModalOpen(false)
    }

    // redirect to home page
    const onModalCancel = () => {
        setModalOpen(false)
        return navigate('/home');
    }

    const onFinish = (values) => {
        setLoading(true)
        setMessage('');
        const data = {
            username: values.username,
            password: values.password,
        };

        login(data, values.google)
            .then((res) => {
                signIn({
                    token: NOT_HAVE_MEANING_FOR_TOKEN,
                    expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                    authState: {
                        id: res.data.userId,
                        email: res.data.email,
                        username: res.data.username,
                        roleName: res.data.roleName,
                    },
                    //refreshToken: res.data.refreshToken,
                    //refreshTokenExpireIn: 15,
                });
                saveDataAuthToCookies(res.data.userId, res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                /*
                switch (res.data.roleName) {
                    case ADMIN_ROLE:
                        return navigate('/admin');
                    case CUSTOMER_ROLE:
                        return navigate('/home');
                    default:
                        throw new Error();
                }
                */
                return navigate('/home');
            })
            .catch((err) => {
                setMessage(err.response.data);
                if (err.response.status === 416) { //handle 2FA
                    return navigate(`/verification2FA/${err.response.data}`);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })


    };
    const onFinishFailed = (errorInfo) => { };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Modal
                title={
                    <>
                        <WarningOutlined style={{ fontSize: 30, color: "#faad14" }} />
                        <b> Warning</b>
                    </>}
                open={modalOpen}
                onOk={onModalOk}
                onCancel={onModalCancel}
            >
                <p>Are you sure to sign out current account ?</p>
            </Modal>

            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {message !== '' ? (
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 0,
                        }}
                    >
                        <span style={{ color: 'red' }}>{message}</span>
                    </Form.Item>
                ) : (
                    ''
                )}

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Spin spinning={loading} indicator={loadingIcon} />
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <GoogleSignIn onFinish={onFinish} />
                </Form.Item>
            </Form>
            <Link to={'/signup'}>Chưa có tài khoản?</Link>

        </GoogleOAuthProvider>
    );
}

export default Login;
