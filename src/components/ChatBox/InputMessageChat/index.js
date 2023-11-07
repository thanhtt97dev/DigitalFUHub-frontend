import React, { useState } from 'react';
import uploadButton from './UploadButton';
import { sendMessage } from '~/api/chat';
import { useAuthUser } from 'react-auth-kit';
import { getVietnamCurrentTime } from '~/utils';
import { Input, Button, Col, Row, Upload, Form } from 'antd';
import { SendOutlined, FileImageOutlined } from '@ant-design/icons';

const InputMessageChat = ({ conversationSelected }) => {
    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [form] = Form.useForm();
    const [newMessage, setNewMessage] = useState('');
    const [isUploadFile, setIsUploadFile] = useState(false);
    ///

    ///handles
    const handleOpenUploadFile = () => {
        setIsUploadFile(!isUploadFile)
    }

    const onFinish = (values) => {
        if (user === null || user === undefined) return;
        const { fileUpload } = values;
        if ((newMessage === undefined || newMessage.length === 0) && fileUpload === undefined) return;
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
                    form.resetFields();
                    setIsUploadFile(false);
                    setNewMessage('');
                }
            })
            .catch(error => {
                console.error(error);
            });

    };

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }
    ///

    /// functions
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    ///

    ///styles
    const styleFormInputMessage = {
        position: 'absolute',
        bottom: 0,
        width: '95%',
        marginBottom: 15
    }
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
                                    multiple={false}
                                    maxCount={1}
                                    accept=".png, .jpeg, .jpg"
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                ) : (<></>)}
            <Row>
                <Col span={2}>
                    <Button style={{ marginLeft: 15 }} type="primary" shape="circle" icon={<FileImageOutlined />} size={30} onClick={handleOpenUploadFile} />
                </Col>
                <Col span={22}>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleChangeNewMessage}
                        disabled={isUploadFile}
                        suffix={
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                htmlType="submit"
                            />
                        }
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default InputMessageChat;