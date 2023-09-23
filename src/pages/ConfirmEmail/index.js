import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from 'antd';
import { confirmEmail, generateTokenConfirmEmail } from "~/api/user";

function ConfirmEmail() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();
    const timeoutId = useRef()

    const notification = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
            duration: 5
        });
    };
    useEffect(() => {
        const tokenParam = searchParams.get("token");
        confirmEmail(tokenParam)
            .then((res) => {
                notification('success', 'Xác thực tài khoản thành công')
                timeoutId.current = setTimeout(() => navigate('/login'), 4000)
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

        return () => clearTimeout(timeoutId.current)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values) => {
        generateTokenConfirmEmail(values.email)
            .then((res) => {
                notification('success', `Vui lòng đi đến ${values.email} để xác thực tài khoản.`)
            })
            .catch((err) => {
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
            })
    }
    return <div style={{
        margin: '40px auto',
        width: '1000px'
    }}>
        {contextHolder}
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
    </div>;
}

export default ConfirmEmail;