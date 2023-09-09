import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFile } from '~/api/storage';
import {
    notification,
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function UploadFile() {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: type === 'success' ? 'Upload File Successfully!' : 'Upload File Error!',
            description: '',
        });
    };
    const onFinish = (values) => {
        var bodyFormData = new FormData();
        bodyFormData.append('isPublic', values.visible);
        bodyFormData.append('userId', 1);
        bodyFormData.append('fileUpload', values.upload[0].originFileObj);
        console.log(values);
        uploadFile('api/Files/Upload', bodyFormData)
            .then((res) => { openNotificationWithIcon('success') })
            .catch((err) => { openNotificationWithIcon('error') });
    };
    return (
        <>
            {contextHolder}
            <Form
                name="control-hooks"
                form={form}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
            >
                <Form.Item label="Visible" name="visible" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Upload" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload listType="picture-card" maxCount={1}>
                        <div>
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                Upload
                            </div>
                        </div>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType="submit">Upload</Button>
                </Form.Item>

            </Form>
        </>
    );
};
export default UploadFile;