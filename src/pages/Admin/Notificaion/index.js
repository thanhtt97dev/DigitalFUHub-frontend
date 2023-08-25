import React from 'react';
import { Button, Form, Input } from 'antd';

import { sendMessageForUser } from '~/api/signalr/notification';

function Notificaion() {
    const onFinish = (values) => {
        const data = {
            title: values.title,
            content: values.content,
        };
        sendMessageForUser(values.userId, data);
    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 0,
                }}
                style={{
                    maxWidth: 500,
                    position: 'relative',
                }}
                onFinish={onFinish}
            >
                <Form.Item label="User ID" name="userId">
                    <Input />
                </Form.Item>
                <Form.Item label="Title" name="title">
                    <Input />
                </Form.Item>
                <Form.Item label="Content" name="content">
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form>
        </>
    );
}

export default Notificaion;
