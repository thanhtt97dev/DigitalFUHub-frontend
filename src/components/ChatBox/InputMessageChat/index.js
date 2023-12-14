import React, { useState } from 'react';
import { sendMessage } from '~/api/chat';
import { useAuthUser } from 'react-auth-kit';
import { getVietnamCurrentTime } from '~/utils';
import { Input, Button, Col, Row, Upload, Form, Modal } from 'antd';
import { SendOutlined, FileImageOutlined, PlusOutlined } from '@ant-design/icons';

///styles
const styleFormInputMessage = {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    marginBottom: 15
}
///

const InputMessageChat = ({ conversationSelected }) => {
    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [form] = Form.useForm();
    const [isLoadingButtonSend, setIsLoadingButtonSend] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [newMessageImageFile, setNewMessageImageFile] = useState([]);
    const [isUploadFile, setIsUploadFile] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    ///

    ///handles

    const handleCancel = () => setPreviewOpen(false);

    const handleMessageImageChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setNewMessageImageFile(newFileList);
    };

    const handleOpenUploadFile = () => {
        setNewMessage('');
        if (isUploadFile) resetFieldNewMessageImage();
        setIsUploadFile(!isUploadFile)
    }

    const onFinish = (values) => {
        if (user === null || user === undefined) return;
        const { fileUpload } = values;
        if ((newMessage === undefined || newMessage.length === 0) && fileUpload === undefined) return;
        setIsLoadingButtonSend(true);

        const currentTime = getVietnamCurrentTime();

        var bodyFormData = new FormData();
        bodyFormData.append('conversationId', conversationSelected.conversationId);
        bodyFormData.append('UserId', user.id);
        bodyFormData.append('content', newMessage);
        for (var i = 0; i < fileUpload?.length || 0; i++) {
            bodyFormData.append('Image', fileUpload[i].originFileObj);
        }
        for (var j = 0; j < conversationSelected.users.length || 0; j++) {
            bodyFormData.append('RecipientIds', conversationSelected.users[j].userId);
        }
        bodyFormData.append('dateCreate', currentTime);

        sendMessage(bodyFormData)
            .then((res) => {
                if (res.status === 200) {
                    if (newMessageImageFile.length > 0) {
                        setIsUploadFile(false);
                        resetFieldNewMessageImage();
                    }
                    if (newMessage) setNewMessage('');

                    setIsLoadingButtonSend(false);
                }
            })
            .catch(error => { });
    };

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }

    const handlePreviewImage = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewImageTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    ///

    /// functions
    const resetFieldNewMessageImage = () => {
        setNewMessageImageFile([]);
        setPreviewImage('');
        form.resetFields();
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    ///

    return (
        <Form
            name="control-hooks"
            form={form}
            onFinish={onFinish}
            style={styleFormInputMessage}
        >
            {
                isUploadFile ? (
                    <Row>
                        <Col span={24}>
                            <Form.Item name="fileUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload
                                    beforeUpload={false}
                                    listType="picture-card"
                                    fileList={newMessageImageFile}
                                    onPreview={handlePreviewImage}
                                    onChange={handleMessageImageChange}
                                    maxCount={1}
                                    accept=".png, .jpeg, .jpg"
                                >
                                    {newMessageImageFile.length < 1 ? <div>
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Tải lên
                                        </div>
                                    </div> : null}
                                </Upload>
                            </Form.Item>


                            <Modal open={previewOpen} title={previewImageTitle} footer={null} onCancel={handleCancel}>
                                <img
                                    alt="thumbnail"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal >
                        </Col>
                    </Row>
                ) : (<></>)}
            <Row>
                <Col span={2}>
                    <Button style={{ marginLeft: 15 }} type="primary" shape="circle" icon={<FileImageOutlined />} size={30} onClick={handleOpenUploadFile} />
                </Col>
                <Col span={22}>
                    <Input
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={handleChangeNewMessage}
                        disabled={isUploadFile}
                        suffix={
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                loading={isLoadingButtonSend}
                                htmlType="submit"
                                disabled={((newMessage === undefined || newMessage.length === 0) && newMessageImageFile.length < 1)}
                            />
                        }
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default InputMessageChat;