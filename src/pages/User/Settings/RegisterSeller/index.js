import { Card, Row, Col, Form, Input, Button } from "antd";
import { getUserId } from "~/utils";
import { registerShop } from "~/api/shop";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Spinning from "~/components/Spinning";
import { useSignOut } from "react-auth-kit";
import { removeDataAuthInCookies } from '~/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { checkExistShopName } from "~/api/shop";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";

const validatorFields = {
    checkExistShopName: () => ({
        async validator(_, value) {
            const data = value === undefined ? '' : value.trim();
            if (!data.trim()) return Promise.resolve();
            let isExist = false;
            await checkExistShopName(data)
                .then((res) => {
                    isExist = res.data.status.responseCode === RESPONSE_CODE_SUCCESS ? false : true;
                })
                .catch((err) => {
                    isExist = true;
                });
            if (isExist === false) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Tên cửa hàng không hợp lệ.'));
        },
    })
}


function RegisterSeller() {
    const notification = useContext(NotificationContext);
    const signOut = useSignOut()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [shopDescription, setShopDescription] = useState('');

    const navigate = useNavigate()

    const onFinish = (values) => {
        setLoading(true);
        const data = {
            shopName: values.shopName,
            shopDescription: shopDescription,
            userId: getUserId()
        }
        registerShop(data)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Thành công", "Đăng ký thành công vui lòng đăng nhập lại.");
                    removeDataAuthInCookies();
                    signOut();
                    return navigate('/login');

                } else {
                    notification('error', "Thất bại", res.data.status.message);
                }
            })
            .catch(err => {
                setLoading(false);
                notification('error', "Thất bại", "Đã có lỗi xảy ra vui lòng thử lại sau.");
            })
    }
    return (
        <Spinning spinning={loading}>
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
                            onFinish={onFinish}
                            form={form}
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            // name="control-hooks"
                            labelWrap
                        >
                            <Form.Item name='shopName' label="Tên cửa hàng" required
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            const data = value === undefined ? '' : value.trim();
                                            if (data) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(new Error('Tên cửa hàng không để trống.'));
                                            }
                                        },
                                    }),
                                    validatorFields.checkExistShopName(),
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item name='shopDescription' label="Mô tả cửa hàng:" required
                                rules={[
                                    (getFieldValue) => ({
                                        validator(_, value) {
                                            if (shopDescription.trim()) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mô tả cửa hàng không để trống.'));
                                        },
                                    }),
                                ]}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={shopDescription}
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'undo', 'redo',]
                                    }}
                                    onReady={editor => {
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setShopDescription(data);
                                    }}
                                    onBlur={(event, editor) => {
                                    }}
                                    onFocus={(event, editor) => {
                                    }}
                                />
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