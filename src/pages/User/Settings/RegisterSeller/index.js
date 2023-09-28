import { Card, Row, Col, Form, Input, Button, notification } from "antd";
import { getUserId, removeUserInfoInCookie } from "~/utils";
import { registerSeller } from "~/api/seller";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinning from "~/components/Spinning";
import { useSignOut } from "react-auth-kit";
import { removeDataAuthInCookies } from '~/utils';

function RegisterSeller() {
    const signOut = useSignOut()
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const openNotificationWithIcon = (type, description) => {
        api[type]({
            message: '',
            description: `${description}`
        });
    };
    const onFinish = (values) => {
        setLoading(true);
        const data = {
            shopName: values.shopName,
            shopDescription: values.shopDescription,
            userId: getUserId()
        }
        registerSeller(data)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    setDisable(true)
                    openNotificationWithIcon('success', "Đăng ký thành công vui lòng đăng nhập lại.");
                    const idTimeout = setTimeout(() => {
                        clearTimeout(idTimeout);
                        removeDataAuthInCookies();
                        signOut();
                        return navigate('/login');
                    }, 2000)
                } else {
                    openNotificationWithIcon('error', res.data.status.message);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
                openNotificationWithIcon('error', "Đã có lỗi xảy ra vui lòng thử lại sau.");
            })
    }
    return (
        <Spinning spinning={loading}>
            {contextHolder}
            <Card
                title="Đăng ký người bán hàng"
                style={{
                    width: '100%',
                }}
                type="inner"
            >
                <Row>
                    <Col span={20} offset={1}>
                        <Form
                            disabled={disable}
                            onFinish={onFinish}
                            form={form}
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            name="control-hooks"
                            labelWrap
                        >
                            <Form.Item name='shopName' label="Tên cửa hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên cửa hàng không để trống."
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name='shopDescription' label="Mô tả cửa hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Mô tả cửa hàng không để trống."
                                    }
                                ]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item

                                wrapperCol={{
                                    span: 14,
                                    offset: 6
                                }}
                                style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit">Đăng ký</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Spinning>)
}

export default RegisterSeller;