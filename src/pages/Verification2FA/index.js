import React, { useEffect, useContext } from 'react';
import { useSignIn } from 'react-auth-kit';
import { Button, Card, Form, Input, Space } from 'antd';

import { generateAccessToken } from '~/api/user'

import { NotificationContext } from '~/context/UI/NotificationContext';

import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';
import { saveDataAuthToCookies, getUser } from '~/utils';
import ModalSend2FaQrCode from '~/components/Modals/ModalSend2FaQrCode';


const layout = {
    labelCol: {
        span: 9,
    },
    wrapperCol: {
        span: 6,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 9,
        span: 12,
    },
};

function Verification2FA() {

    const signIn = useSignIn();

    const notification = useContext(NotificationContext);

    const path = window.location.pathname;
    const userId = path.split("/")[2];


    useEffect(() => { // use for prevent user was logined but still want to verify Two Factor Authentication
        const user = getUser();
        if (user != null) {
            return window.location.replace("/home")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values) => {
        const data = {
            code: values.code
        }
        generateAccessToken(userId, data)
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

                return window.location.replace("/home")
            }).catch((err) => {
                notification("error", "Mã PIN không đúng! Vui lòng thử lại!")
            })
    };

    return (
        <>
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "50px",
                    marginTop: "100px"
                }}
            >
                Nhập mã PIN xác thực 2 bước
            </h2>

            <Form
                {...layout}
                onFinish={onFinish}
            >
                <Form.Item
                    name="code"
                    label="PIN"
                    rules={[
                        {
                            required: true,
                            message: "Mã PIN không được trống"
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space style={{ marginLeft: "40px", marginTop: "20px" }}>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                        <ModalSend2FaQrCode userId={userId} />
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}

export default Verification2FA;


