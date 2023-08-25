import React from 'react';
import { Button, Form, Input } from 'antd';

import { sendNotification } from '~/api/user';

function Notificaion() {
    const onFinish = (values) => {
        const data = {
            titile: values.title,
            message: values.message,
        };
        console.log(data);
        sendNotification(values.userId, data);
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
                <Form.Item label="Message" name="message">
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
