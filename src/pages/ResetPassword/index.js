import { useState } from "react";
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import { resetPassword } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useContext } from "react";
import { RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_RESET_PASSWORD_ACCOUNT_BANNED, RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM, RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE, RESPONSE_CODE_SUCCESS } from "~/constants";
import { Link } from "react-router-dom";
function ResetPassword() {
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const onFinish = (values) => {
        setLoading(true);
        resetPassword(values.email)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification('success', `Mật khẩu mới đã được gửi đến email ${values.email}.`)
                } else if (res.data.status.responseCode === RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM) {
                    notification('error', `Vui lòng xác nhận tài khoản trước khi đặt lại mật khẩu.`);
                } else if (res.data.status.responseCode === RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE) {
                    notification('error', `Tài khoản của bạn chưa từng đặt mật khẩu vui lòng đăng nhập tài khoản bằng Google và đặt mật khẩu cho tài khoản trước khi quên mật khẩu.`);
                } else if (res.data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                    notification('error', `Tài khoản không tồn tại.`);
                } else if (res.data.status.responseCode === RESPONSE_CODE_RESET_PASSWORD_ACCOUNT_BANNED) {
                    notification('error', `Tài khoản đang bị khóa không thể đặt lại mật khẩu.`);
                } else {
                    notification('error', `Vui lòng kiểm tra lại.`);
                }
            })
            .catch((err) => {
                notification('error', 'Đã có lỗi xảy ra.')
            })
            .finally(() => {
                setLoading(false);
            })
    }
    return <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Spin spinning={loading}>
            <Row style={{
                boxShadow: '0px 0px 6px -2px #2673dd',
                borderRadius: '10px',
                overflow: 'hidden',
            }}>
                <Col>
                    <img style={{ height: '100%' }} alt="" src={'https://bcp.cdnchinhphu.vn/Uploaded/phungthithuhuyen/2020_05_21/5542_1604_thuong_mai_dt.jpg'} />
                </Col>
                <Col style={{ padding: '20px ' }}>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={onFinish}
                        style={{
                            maxWidth: 900,
                            width: '400px',
                            marginTop: '5rem',
                        }}
                    >

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
                        <Link to={"/login"}>Đã có tài khoản?</Link>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button size="large" type="primary" htmlType="submit">Xác nhận</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Spin>
    </div >;
}

export default ResetPassword;