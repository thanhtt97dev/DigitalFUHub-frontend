import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin, Modal, Space, Row, Col } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { useSignIn } from 'react-auth-kit';

import { login } from '~/api/user';
import { saveDataAuthToCookies, removeDataAuthInCookies, getUser, encryptPassword } from '~/utils';
import { ADMIN_ROLE, NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';
import GoogleSignIn from '~/components/GoogleSignIn';
import bannerLogin from '~/assets/images/banner_login.jpg'
// import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
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
        let data = {
            username: values.username,
            password: values.password ? encryptPassword(values.password) : null,
        };
        if (values.google === true) {
            data = { gToken: values.gToken };
        }
        login(data, values.google)
            .then((res) => {
                //rule: this FE just for customer, seller
                if (res.data.roleName === ADMIN_ROLE) {
                    setMessage("Bạn không có quyền để đăng nhập! Hãy thử một tài khoản khác!")
                } else {
                    signIn({
                        token: NOT_HAVE_MEANING_FOR_TOKEN,
                        expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                        authState: {
                            id: res.data.userId,
                            username: res.data.username,
                            email: res.data.email,
                            fullname: res.data.fullname,
                            avatar: res.data.avatar,
                            roleName: res.data.roleName,
                            twoFactorAuthentication: res.data.twoFactorAuthentication,
                            signInGoogle: res.data.signInGoogle,
                        },
                    });
                    saveDataAuthToCookies(res.data.userId, res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                    return window.location.replace("/home");
                }
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
        <Spin spinning={loading} indicator={loadingIcon}>
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Row style={{
                    boxShadow: '0px 0px 6px -2px #2673dd',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    <Col>
                        <img style={{ height: '100%' }} alt="" src={bannerLogin} />
                    </Col>
                    <Col>
                        <Modal
                            title={
                                <>
                                    <WarningOutlined style={{ fontSize: 30, color: "#faad14" }} />
                                    <b> Cảnh báo</b>
                                </>}
                            open={modalOpen}
                            onOk={onModalOk}
                            onCancel={onModalCancel}
                        >
                            <p>Bạn có chắc đăng xuất tài khoản hiện tại không?</p>
                        </Modal>
                        <Form
                            layout='vertical'
                            // labelCol={{
                            //     span: 8,
                            // }}
                            // wrapperCol={{
                            //     span: 16,
                            // }}
                            style={{
                                maxWidth: 600,
                                width: 400,
                                padding: 20,
                                // marginTop: '-10rem'
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Đăng Nhập</h4>
                            <Form.Item
                                label="Tài khoản"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tài khoản không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input size='large' />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input.Password size='large' />
                            </Form.Item>

                            {message !== '' ? (
                                <Form.Item
                                // wrapperCol={{
                                //     offset: 8,
                                //     span: 0,
                                // }}
                                >
                                    <span style={{ color: 'red' }}>{message}</span>
                                </Form.Item>
                            ) : (
                                ''
                            )}


                            <Form.Item style={{ textAlign: 'center' }}
                            // wrapperCol={{
                            //     offset: 8,
                            //     span: 16,
                            // }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space.Compact style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Link to={'/resetPassword'}>Quên mật khẩu?</Link>
                                        <Link to={'/signup'}>Chưa có tài khoản?</Link>
                                    </Space.Compact>
                                    <Space.Compact >
                                        <Button size='large' type="primary" htmlType="submit">
                                            Đăng nhập
                                        </Button>
                                    </Space.Compact>
                                </Space>
                            </Form.Item>
                            <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleSignIn onFinish={onFinish} />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

            </div>
        </Spin >
    );
}

export default Login;
