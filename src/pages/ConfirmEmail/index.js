import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button, Col, Form, Input, Row, Spin } from 'antd';
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
    return <Spin spinning={loading}>
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
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
                            width: '400px',
                            maxWidth: 900,
                            marginTop: '5rem',
                            padding: '10px'
                        }}
                    >
                        <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Xác Thực Email</h4>
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
                            <Button size='large' type="primary" htmlType="submit">Xác nhận</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </div>
    </Spin>;
}

export default ConfirmEmail;