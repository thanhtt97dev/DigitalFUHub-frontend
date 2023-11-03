import React from 'react';
import { SendOutlined, FileImageOutlined } from '@ant-design/icons';
import { Input, Button, Col, Row, Upload, Form } from 'antd';


const InputMessageChat = ({ form,
    onFinish,
    normFile,
    uploadButton,
    newMessage,
    handleChangeNewMessage,
    isUploadFile,
    handleOpenUploadFile }) => {

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
                                    listType="picture-card"
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