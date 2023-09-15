import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    Button,
    Form,
    Input,
    Upload,
    Space
} from 'antd';
import classNames from 'classnames/bind';
import styles from './SignUp.module.scss';

const cx = classNames.bind(styles)

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        }
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function SignUp() {
    const [fileUpload, setFileUpload] = useState([]);
    const [filePreview, setFilePreview] = useState('');
    const [form] = Form.useForm();
    const handleChange = async (info) => {
        URL.revokeObjectURL(filePreview);
        let newFileList = [...info.fileList];

        // Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-1);

        // Read from response and show file link
        newFileList = newFileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setFileUpload(newFileList);
        setFilePreview(newFileList.length > 0 ? URL.createObjectURL(newFileList[0].originFileObj) : '')
    };
    const props = {
        onChange: handleChange,
        multiple: false,
        accept: 'image/*',
        maxCount: 1
    };
    const onFinish = (values) => {
        console.log(values);
    }

    return (
        <>
            <Form
                {...formItemLayout}
                form={form}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                onFinish={onFinish}
                style={{
                    maxWidth: 800,
                }}
            >
                <Form.Item label="Avatar" name='avatar'
                    getValueFromEvent={normFile}
                    rules={[{
                        required: true,
                        message: 'Please upload your avatar'
                    },
                    ]}>
                    <Upload {...props} fileList={fileUpload}>
                        <Space wrap={true}>
                            <div className={cx('preview-img')}>
                                {filePreview && <img src={filePreview} alt='' />}
                            </div>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Space>
                    </Upload>
                </Form.Item>
                <Form.Item label="Fullname" name='fullname'
                    rules={[{
                        required: true,
                        message: 'Please input your fullname!'
                    }]}
                >
                    <Input placeholder='Fullname' />
                </Form.Item>
                <Form.Item label="Email"
                    name='email'
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid email!',
                        },
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input placeholder='Email' />
                </Form.Item>
                <Form.Item label="Password"
                    name="password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                    <Input.Password placeholder='Password' />
                </Form.Item>
                <Form.Item label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input Confirm Password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The confirm password that you entered do not match!'));
                            },
                        }),
                    ]}>
                    <Input.Password placeholder='Confirm Password' />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default SignUp;