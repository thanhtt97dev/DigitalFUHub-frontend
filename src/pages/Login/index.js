import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import { useSignIn } from 'react-auth-kit';

import { login } from '~/api/user';
import { saveDataAuthToCookies } from '~/utils';
import { ADMIN_ROLE, User_ROLE } from '~/constants';

function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    let [message, setMessage] = useState('');

    const onFinish = (values) => {
        const data = {
            email: values.username,
            password: values.password,
        };

        login(data)
            .then((res) => {
                if (res.status === 200) {
                    if (
                        signIn({
                            token: res.data.accessToken,
                            expiresIn: 10,
                            tokenType: 'Bearer',
                            authState: {
                                id: res.data.userId,
                                email: res.data.email,
                                firstName: res.data.email,
                                roleName: res.data.roleName,
                            },
                            //refreshToken: res.data.refreshToken,
                            //refreshTokenExpireIn: 15,
                        })
                    ) {
                        saveDataAuthToCookies(res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                        switch (res.data.roleName) {
                            case ADMIN_ROLE:
                                return navigate('/admin');
                            case User_ROLE:
                                return navigate('/home');
                            default:
                                throw new Error();
                        }
                    }
                }
            })
            .catch((err) => {
                if (err.response === undefined) {
                    console.log(err);
                    setMessage('Some err!');
                    return;
                }
                if (err.response.status === 401) {
                    setMessage('Email or password was wrong!');
                } else if (err.response.status === 500) {
                    setMessage('Server not respone! Try again!');
                } else {
                    setMessage('Server not respone! Try again!');
                }
            });
    };
    const onFinishFailed = (errorInfo) => {};

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

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
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
