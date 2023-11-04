import { Card, Row, Col, Form, Input, Button } from "antd";
import { registerShop } from "~/api/shop";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Spinning from "~/components/Spinning";
import { useSignOut } from "react-auth-kit";
import { getUserId, removeDataAuthInCookies } from '~/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { checkExistShopName } from "~/api/shop";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import debounce from "debounce-promise";

const debounceCheckExistShopName = debounce((data) => {
    const res = checkExistShopName(data);
    return Promise.resolve({ res: res });
}, 500);

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
            userId: getUserId(),
            shopName: values.shopName,
            shopDescription: shopDescription,
        }
        registerShop(data)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Đăng ký thành công vui lòng đăng nhập lại.");
                    removeDataAuthInCookies();
                    signOut();
                    return navigate('/login');

                } else {
                    notification('error', res.data.status.message);
                }
            })
            .catch(err => {
                setLoading(false);
                notification('error', "Đã có lỗi xảy ra vui lòng thử lại sau.");
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
                                                return new Promise((resolve, reject) => {
                                                    debounceCheckExistShopName(data)
                                                        .then(({ res }) => {
                                                            res.then(res => {
                                                                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                                    resolve();
                                                                } else {
                                                                    reject(new Error('Tên cửa hàng không khả dụng.'));
                                                                }
                                                            }).catch(err => {
                                                                reject(new Error('Tên cửa hàng không khả dụng.'));
                                                            })
                                                        });
                                                })
                                            } else {
                                                return Promise.reject(new Error('Tên cửa hàng không để trống.'));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item name='shopDescription' label="Mô tả cửa hàng:" required
                                rules={[
                                    ({ getFieldValue }) => ({
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