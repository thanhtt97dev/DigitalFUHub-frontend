import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    Button,
    Form,
    Input,
    Spin,
    notification
    // Upload,
    // Space
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkExistEmail, signUp, checkExistUsername } from '~/api/user';
// import classNames from 'classnames/bind';
// import styles from './SignUp.module.scss';
import { encryptPassword, regexPattern } from '~/utils';
// const cx = classNames.bind(styles)

// const normFile = (e) => {
//     if (Array.isArray(e)) {
//         return e;
//     }
//     return e && e.fileList;
// };

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
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

const validatorFields = {
    checkExistUsername: () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            let isExist = false;
            checkExistUsername(value)
                .then(res => {
                    isExist = res.data === 'Y' ? true : false;
                })
                .catch(err => {
                    isExist = false;
                });
            if (!isExist) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Email đã tồn tại!'));
        },
    }),
    checkExistEmail: () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            let isExist = false;
            checkExistEmail(value)
                .then(res => {
                    isExist = res.data === 'Y' ? true : false;
                })
                .catch(err => {
                    isExist = false;
                });
            if (!isExist) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Email đã tồn tại!'));
        },
    }),
    checkFormatUsername: () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            const result = regexPattern(value, "^[a-z][a-z\\d]{6,12}$")
            if (result) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Tên tài khoản phải bắt đầu với kí tự chữ thường và có độ dài 6 - 12 kí tự!'));
        },
    }),

    checkFormatFullname: () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            if (value.trim()) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Họ tên không được trống!'));
        },
    }),
    checkFormatPassword: (message) => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            const result = regexPattern(value, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,16}$")
            if (result) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message));
        },
    }),

    checkCfPasswordMatch: (getFieldValue) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu xác nhận đã nhập không khớp!'));
        },
    }),
}

function SignUp() {
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const onFinish = (values) => {
        setDisabled(true);
        const dataBody = {
            fullname: values.fullname,
            password: encryptPassword(values.password),
            confirmPassword: encryptPassword(values.confirmPassword),
            email: values.email,
            username: values.username
        }
        signUp(dataBody)
            .then(res => {
                setDisabled(false);
                return navigate('/confirmEmail')
            })
            .catch(err => {
                setDisabled(false);
                openNotificationWithIcon('error');
            })
    }
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Đã có lỗi xảy ra vui lòng thử lại sau!',
            description:
                '',
        });
    };

    return (
        <>
            {contextHolder}
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
                    maxWidth: 900,
                }}
            >

                <Form.Item label="Họ tên" name='fullname'
                    rules={[{
                        required: true,
                        message: 'Họ tên không được trống!'
                    },
                    validatorFields.checkFormatFullname(),
                    ]}
                >
                    <Input placeholder='Họ tên' />
                </Form.Item>
                <Form.Item label="Tên tài khoản" name='username'
                    rules={[
                        {
                            required: true,
                            message: 'Tên tài khoản không được trống!'
                        },
                        validatorFields.checkFormatUsername(),
                        validatorFields.checkExistUsername(),
                    ]}
                >
                    <Input placeholder='Tên tài khoản' />
                </Form.Item>
                <Form.Item label="Email"
                    name='email'
                    rules={[
                        {
                            type: 'email',
                            message: 'Email nhập không hợp lệ!',
                        },
                        {
                            required: true,
                            message: 'Email không được để trống!',
                        },
                        validatorFields.checkExistEmail(),
                    ]}
                >
                    <Input placeholder='Email' />
                </Form.Item>
                <Form.Item label="Mật khẩu"
                    name="password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu không để trống!',
                        },
                        validatorFields.checkFormatPassword('Mật khẩu chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự!'),
                    ]}>
                    <Input.Password placeholder='Mật khẩu' />
                </Form.Item>
                <Form.Item label="Mật khẩu xác nhận"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu xác nhận không để trống!',
                        },
                        ({ getFieldValue }) => validatorFields.checkCfPasswordMatch(getFieldValue),
                        validatorFields.checkFormatPassword('Mật khẩu xác nhận chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự!'),
                    ]}>
                    <Input.Password placeholder='Mật khẩu xác nhận' />
                </Form.Item>

                <Form.Item  {...tailFormItemLayout}>

                    <Button style={{ position: 'relative' }} disabled={disabled} type="primary" htmlType="submit">
                        Đăng ký
                        {disabled && <Spin style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} indicator={antIcon} />}
                    </Button>


                </Form.Item>
            </Form >
        </>
    );
};
export default SignUp;