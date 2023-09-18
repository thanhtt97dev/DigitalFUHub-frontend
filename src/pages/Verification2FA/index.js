import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit';
import { Button, Form, Input, Space, message } from 'antd';

import { generateAccessToken } from '~/api/user'

import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';
import { saveDataAuthToCookies, getUser } from '~/utils';
import ModalSend2FaQrCode from '~/components/Modals/ModalSend2FaQrCode';


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

function Verification2FA() {

    const signIn = useSignIn();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const path = window.location.pathname;
    const userId = path.split("/")[2];


    useEffect(() => { // use for prevent user was logined but still want to verify Two Factor Authentication
        const user = getUser();
        if (user != null) {
            alert("You not have permission to view this site!")
            return navigate("/home")
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

                return navigate("/home")
            }).catch((err) => {
                error();
            })
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Code invalid! Try again!',
        });
    };

    return (
        <>
            {contextHolder}
            <Form
                {...layout}
                name="control-ref"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item
                    name="code"
                    label="Code"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <ModalSend2FaQrCode />
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}

export default Verification2FA;


