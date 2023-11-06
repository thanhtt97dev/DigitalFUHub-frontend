import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Spin } from 'antd';
import { confirmEmail, generateTokenConfirmEmail } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useContext } from "react";
import { RESPONSE_CODE_CONFIRM_PASSWORD_IS_CONFIRMED, RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_SUCCESS } from "~/constants";
function ConfirmEmail() {
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            confirmEmail(tokenParam)
                .then((res) => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification('success', 'Xác thực tài khoản thành công.')
                        return navigate('/login');
                    } else {
                        notification('error', 'Vui lòng kiểm tra lại.')
                    }
                })
                .catch((err) => {
                    notification('error', 'Đã có lỗi xảy ra.')
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values) => {
        setLoading(true);
        generateTokenConfirmEmail(values.email)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification('success', `Vui lòng đi đến ${values.email} để xác thực tài khoản.`,)
                } else if (res.data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                    notification('error', `Vui lòng kiểm tra lại.`,)
                } else if (res.data.status.responseCode === RESPONSE_CODE_CONFIRM_PASSWORD_IS_CONFIRMED) {
                    notification('error', `Tài khoản đã được xác thực.`,)
                }
            })
            .catch((err) => {
                setLoading(false);
                notification('error', 'Lỗi', 'Đã có lỗi xảy ra.')
            })

    }
    return <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
    }}>
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