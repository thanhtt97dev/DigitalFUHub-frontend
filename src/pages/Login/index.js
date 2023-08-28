import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSignIn } from 'react-auth-kit';

import { login } from '~/api/user';
import { saveDataAuthToCookies } from '~/utils';
import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';
//import { ADMIN_ROLE, User_ROLE } from "~/constants"

function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    let [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const loadingIcon = (
        <LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />
    )

    const onFinish = (values) => {
        setLoading(true)
        setMessage('');
        const data = {
            email: values.username,
            password: values.password,
        };

        login(data)
            .then((res) => {
                signIn({
                    token: NOT_HAVE_MEANING_FOR_TOKEN,
                    expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                    authState: {
                        id: res.data.userId,
                        email: res.data.email,
                        firstName: res.data.email,
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
                    case User_ROLE:
                        return navigate('/home');
                    default:
                        throw new Error();
                }
                */
                return navigate('/home');
            })
            .catch((err) => {
                setTimeout(() => {
                    setMessage(err.response.data);
                    setLoading(false)
                }, 500)
            });

    };
    const onFinishFailed = (errorInfo) => { };

    return (
        <>
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
            </Form>
            ;
        </>
    );
}

export default Login;
