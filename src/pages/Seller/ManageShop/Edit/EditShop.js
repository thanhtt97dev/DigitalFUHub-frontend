/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Row, Col, Form, Input, Button, Upload, Avatar, Space } from "antd";
import { editShop, getShopOfSeller } from "~/api/shop";
// import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Spinning from "~/components/Spinning";
import { cleanHTML, getUserId } from '~/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function EditShop() {
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [shop, setShop] = useState();
    const [shopDescription, setShopDescription] = useState('');
    const [fileList, setFileList] = useState([]);
    // const navigate = useNavigate()
    const [imgPreview, setImgPreview] = useState('');
    const handlePreview = async (file) => {
        const imgBase64 = await getBase64(file.originFileObj);
        setImgPreview(imgBase64);
    };
    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(newFileList);
        handlePreview(newFileList[0]);
    };

    useEffect(() => {
        getShopOfSeller()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setShop(res.data.result);
                    setImgPreview(res.data.result.avatar)
                    setShopDescription(res.data.result.description)
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
    }, []);

    const onFinish = (values) => {
        setLoading(true);
        const data = {
            userId: getUserId(),
            shopDescription: cleanHTML(shopDescription),
            avatarFile: values.avatarFile ? values.avatarFile.fileList[0].originFileObj : null
        }
        editShop(data)
            .then(res => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Cập nhật thông tin cửa hàng thành công.");
                } else {
                    notification('error', "Vui lòng kiểm tra lại.");
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
                title="Chỉnh sửa thông tin cửa hàng"
                style={{
                    width: '100%',
                }}
                type="inner"
            >
                {shop &&
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row >
                            <Col span={24}>
                                <Space align="center" direction="vertical" style={{ width: '100%' }}>
                                    {imgPreview ?
                                        <Avatar size={100} src={imgPreview} />
                                        :
                                        <Avatar size={100} icon={<UserOutlined />} />
                                    }
                                    <Form.Item name='avatarFile' required style={{ width: '100%', textAlign: 'center' }}>
                                        <Upload showUploadList={false} fileList={fileList} maxCount={1} onChange={handleChange}
                                            accept=".png, .jpeg, .jpg"
                                        >
                                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                                            <div style={{ textAlign: 'center' }}> (PNG, JPG hoặc JPEG)</div>
                                        </Upload>
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={14}
                            // style={{ borderRight: '1px solid rgb(232, 232, 232)' }}
                            >
                                <Row>
                                    <Col span={4}><div>Tên cửa hàng</div></Col>
                                    <Col span={16}>
                                        <Form.Item name='shopName' initialValue={shop.shopName}>
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} ><div>Mô tả</div></Col>
                                    <Col span={16}>
                                        <Form.Item name='shopDescription' required
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
                                    </Col>

                                </Row>
                            </Col>
                            {/* <Col span={4} offset={2} >
                            
                        </Col> */}
                        </Row>
                        <Row justify="center">
                            <Col>
                                <Form.Item
                                    wrapperCol={{
                                        span: 14,
                                        offset: 6
                                    }}
                                    style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit">Xác nhận</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }
            </Card>
        </Spinning>)
}

export default EditShop;