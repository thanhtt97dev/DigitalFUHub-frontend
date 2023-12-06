import { useState } from "react";
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import { resetPassword } from "~/api/user";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useContext } from "react";
import { RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_RESET_PASSWORD_NOT_CONFIRM, RESPONSE_CODE_RESET_PASSWORD_SIGNIN_GOOGLE, RESPONSE_CODE_SUCCESS } from "~/constants";
import { Link } from "react-router-dom";
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
        alignItems: 'center'
    }}>
        <Spin spinning={loading}>
            <Row style={{
                boxShadow: '0px 0px 9px 2px rgba(0,0,0,.4)',
                borderRadius: '10px',
                overflow: 'hidden',
            }}>
                <Col>
                    <img style={{ height: '100%' }} alt="" src={'https://bcp.cdnchinhphu.vn/Uploaded/phungthithuhuyen/2020_05_21/5542_1604_thuong_mai_dt.jpg'} />
                </Col>
                <Col>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={onFinish}
                        style={{
                            maxWidth: 900,
                            width: '400px',
                            marginTop: '5rem',
                            padding: '10px'
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