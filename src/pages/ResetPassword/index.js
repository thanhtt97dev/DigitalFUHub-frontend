import { useState } from "react";
import { Button, Form, Input, Spin } from 'antd';
import { resetPassword } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useContext } from "react";
import { RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM, RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE, RESPONSE_CODE_SUCCESS } from "~/constants";
function ResetPassword() {
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const onFinish = (values) => {
        setLoading(true);
        resetPassword(values.email)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification('success', `Mật khẩu mới đã được gửi đến email ${values.email}.`)
                } else if (res.data.status.responseCode === RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM) {
                    notification('error', `Vui lòng xác nhận tài khoản trước khi đặt lại mật khẩu.`);
                } else if (res.data.status.responseCode === RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE) {
                    notification('error', `Vui lòng tạo tài khoản trước khi đặt lại mật khẩu.`);
                } else if (res.data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                    notification('error', `Không tồn tại tài khoản.`);
                } else {
                    notification('error', `Vui lòng kiểm tra lại.`);
                }
            })
            .catch((err) => {
                setLoading(false);
                notification('error', 'Đã có lỗi xảy ra.')
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
                maxWidth: 900,
                width: '400px',
                marginTop: '10rem',
                padding: '10px'
            }}
        >
            <Spin spinning={loading}>
                <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Đặt Lại Mật Khẩu</h4>
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
                    <Button size="large" type="primary" htmlType="submit">Gửi</Button>
                </Form.Item>
            </Spin>
        </Form>
    </div >;
}

export default ResetPassword;