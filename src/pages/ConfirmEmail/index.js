import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Spin } from 'antd';
import { confirmEmail, generateTokenConfirmEmail } from "~/api/user";

function ConfirmEmail() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const timeoutId = useRef()
    const notification = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
            duration: 5
        });
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            confirmEmail(tokenParam)
                .then((res) => {
                    if (res.data === "Y") {
                        notification('success', 'Xác thực tài khoản thành công.')
                        timeoutId.current = setTimeout(() => navigate('/login'), 4000)
                    } else {
                        notification('error', 'Tài khoản đã được xác thực.')
                    }
                })
                .catch((err) => {
                    switch (err.response.status) {
                        case 409:
                            notification('error', 'Đã quá thời gian xác thực vui lòng gửi lại email xác thực.')
                            break;
                        case 404:
                            notification('error', 'Không thể xác thực tài khoản vui lòng thử lại.')
                            break;
                        default:
                            notification('error', 'Đã có lỗi xảy ra.')
                            break;
                    }
                })
        }

        return () => clearTimeout(timeoutId.current)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values) => {
        setLoading(true);
        generateTokenConfirmEmail(values.email)
            .then((res) => {
                setLoading(false);
                notification('success', `Vui lòng đi đến ${values.email} để xác thực tài khoản.`)
            })
            .catch((err) => {
                setLoading(false);
                if (!err.response) {
                    notification('error', 'Đã có lỗi xảy ra.')
                } else {
                    switch (err.response.status) {
                        case 409:
                            notification('error', 'Tài khoản đã được xác thực.')
                            break;
                        case 404:
                            notification('error', 'Email không tồn tại!')
                            break;
                        default:
                            notification('error', 'Đã có lỗi xảy ra.')
                            break;
                    }
                }
            })

    }
    return <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
    }}>
        {contextHolder}
        <Form
            layout='vertical'
            form={form}
            onFinish={onFinish}
            style={{
                width: '400px',
                maxWidth: 900,
                marginTop: '10rem',
                padding: '10px'
            }}
        >
            <Spin spinning={loading}>
                <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Xác Nhận Email</h4>
                <Form.Item label="Email" name='email'
                    rules={[{
                        type: 'email',
                        message: 'Vui lòng nhập đúng định dạng email!'
                    },
                    {
                        required: true,
                        message: 'Email không được để trống!'
                    }
                    ]}
                >
                    <Input placeholder="Nhập Email" size="large" />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button size='large' type="primary" htmlType="submit">Gửi</Button>
                </Form.Item>
            </Spin>
        </Form>
    </div>;
}

export default ConfirmEmail;