/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Rate, Row, Typography, Form, Upload, Modal, } from "antd";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ModalAddFeedbackOrder(
    { isModalOpen,
        handleModalFeedbackOk,
        handleModalFeedbackCancel,
        handleSubmitFeedback,
    }) {
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        form.resetFields();
        setFileList([])
    }, [isModalOpen])
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = (info) => {
        let newFileList = [...info.fileList];

        newFileList = newFileList.slice(-5);

        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setFileList(newFileList);
    }
    return (<>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
                alt="preview"
                style={{
                    width: '100%',
                }}
                src={previewImage}
            />
        </Modal>
        <Modal
            title="Đánh giá sản phẩm"
            footer={null}
            open={isModalOpen}
            onOk={handleModalFeedbackOk}
            onCancel={handleModalFeedbackCancel}>
            <Form
                form={form}
                onFinish={handleSubmitFeedback}
            >
                <Row>
                    <Col span={8} offset={1}><Text>Điểm đánh giá</Text></Col>
                    <Col span={15}>
                        <Form.Item name="rate"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value !== 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Vui lòng không để trống điểm đánh giá.'));
                                    },
                                }),
                            ]}
                        >
                            <Rate style={{
                                lineHeight: '0'
                            }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={1}><Text>Nội dung</Text></Col>
                    <Col span={15}>
                        <Form.Item name="content"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value) {
                                            return Promise.resolve();
                                        } else if (value.length > 200) {
                                            return Promise.reject(new Error('Nội dung đánh giá không vượt quá 200 ký tự.'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                }),
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={1}><Text>Hình ảnh</Text></Col>
                    <Col span={15}>
                        <Form.Item name="imageFiles">
                            <Upload
                                accept=".png, .jpeg, .jpg"
                                beforeUpload={false}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={5}
                            >

                                {fileList.length >= 5 ? null : <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Tải lên
                                    </div>
                                </div>}
                            </Upload>

                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end" gutter={[16, 0]}>
                    <Col><Button type="default" danger onClick={handleModalFeedbackCancel}>Hủy</Button></Col>
                    <Col><Button type="primary" htmlType="submit">Xác nhận</Button></Col>
                </Row>
            </Form>
        </Modal >
    </>);
}

export default ModalAddFeedbackOrder;