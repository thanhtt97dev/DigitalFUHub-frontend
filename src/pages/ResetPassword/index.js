import { useState } from "react";
import { Button, Form, Input, message, Spin } from 'antd';
import { resetPassword } from "~/api/user";

function ResetPassword() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)
    const notification = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
            duration: 5
        });
    };

    const onFinish = (values) => {
        setLoading(true);
        resetPassword(values.email)
            .then((res) => {
                setLoading(false);
                notification('success', `Mật khẩu mới đã được gửi đến email ${values.email}.`)
            })
            .catch((err) => {
                setLoading(false);
                if (!err.response) {
                    notification('error', 'Đã có lỗi xảy ra.')
                } else {
                    switch (err.response.status) {
                        case 409:
                            notification('error', 'Đã có lỗi xảy ra.')
                            break;
                        case 404:
                            notification('error', 'Tài khoản không tồn tại.')
                            break;
                        default:
                            notification('error', 'Đã có lỗi xảy ra.')
                            break;
                    }
                }
            })
    }
    return <div style={{
        margin: '40px auto',
        width: '1000px'
    }}>
        {contextHolder}
        <Spin spinning={loading}>
            <Form
                layout='vertical'
                form={form}
                onFinish={onFinish}
                style={{
                    maxWidth: '400px',
                }}
            >

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
                    <Input placeholder="Nhập Email" />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Gửi</Button>
                </Form.Item>
            </Form>
        </Spin>
    </div>;
}

export default ResetPassword;