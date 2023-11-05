import { LoadingOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import {
    Alert,
    Button,
    Form,
    Input,
    Spin,
} from 'antd';
import { Link } from 'react-router-dom';
import { checkExistEmail, signUp, checkExistUsername } from '~/api/user';
import { encryptPassword, regexPattern } from '~/utils';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { NotificationContext } from '~/context/NotificationContext';
import debounce from "debounce-promise";

const debounceCheckExistUsername = debounce((data) => {
    const res = checkExistUsername(data);
    return Promise.resolve({ res: res });
}, 500);

const debounceCheckExistEmail = debounce((data) => {
    const res = checkExistEmail(data);
    return Promise.resolve({ res: res });
}, 500);

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function SignUp() {
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    // const navigate = useNavigate();
    const onFinish = (values) => {
        setLoading(true);
        const dataBody = {
            fullname: values.fullname,
            password: encryptPassword(values.password),
            confirmPassword: encryptPassword(values.confirmPassword),
            email: values.email,
            username: values.username
        }
        signUp(dataBody)
            .then(res => {
                form.resetFields();
                setLoading(false);
                setMessage(`Vui lòng đến ${dataBody.email} để xác thực tài khoản.`);
                // return navigate('/confirmEmail')
            })
            .catch(err => {
                setLoading(false);
                notification("error", "Đã có lỗi xảy ra")
            })
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Form
                // {...formItemLayout}
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{
                    maxWidth: 900,
                    width: '500px',
                    padding: '10px'
                }}
            >
                <Spin spinning={loading} indicator={antIcon}>
                    <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Đăng Ký</h4>
                    {message && <Alert message={message} type="success" />}
                    <Form.Item label="Họ tên" name='fullname'
                        required
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject(new Error('Họ tên không để trống'));
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input placeholder='Họ tên' size='large' />
                    </Form.Item>
                    <Form.Item label="Tên tài khoản" name='username'
                        required
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data) {
                                        const result = regexPattern(value, "^(?=[a-z])[a-z\\d]{6,12}$")
                                        if (result) {
                                            return new Promise((resolve, reject) => {
                                                debounceCheckExistUsername(value)
                                                    .then(({ res }) => {
                                                        res.then(res => {
                                                            if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                                resolve();
                                                            } else {
                                                                reject(new Error('Tên tài khoản không khả dụng'));
                                                            }
                                                        }).catch(err => {
                                                            reject(new Error('Tên tài khoản không khả dụng'));
                                                        });
                                                    })
                                            })
                                        } else {
                                            return Promise.reject(new Error('Tên tài khoản phải bắt đầu với kí tự chữ thường và có độ dài 6 - 12 kí tự'));
                                        }
                                    } else {
                                        return Promise.reject(new Error('Tên tài khoản không để trống'));
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input placeholder='Tên tài khoản' size='large' />
                    </Form.Item>
                    <Form.Item label="Email"
                        required
                        name='email'
                        rules={[
                            {
                                type: 'email',
                                message: 'Email nhập không hợp lệ!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data) {
                                        return new Promise((resolve, reject) => {
                                            debounceCheckExistEmail(value)
                                                .then(({ res }) => {
                                                    res.then(res => {
                                                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                            resolve();
                                                        } else {
                                                            reject(new Error('Email không khả dụng'));
                                                        }
                                                    }).catch(err => {
                                                        reject(new Error('Email không khả dụng'));
                                                    });
                                                })
                                        })
                                    } else {
                                        return Promise.reject(new Error('Email không được để trống'));
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input placeholder='Email' size='large' />
                    </Form.Item>
                    <Form.Item label="Mật khẩu"
                        name="password"
                        required
                        // hasFeedback
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data) {
                                        const result = regexPattern(value, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,16}$")
                                        if (result) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(new Error('Mật khẩu chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự'));
                                        }
                                    } else {
                                        return Promise.reject(new Error('Mật khẩu không để trống'));
                                    }
                                },
                            }),
                        ]}>
                        <Input.Password placeholder='Mật khẩu' size='large' />
                    </Form.Item>
                    <Form.Item label="Mật khẩu xác nhận"
                        name="confirmPassword"
                        dependencies={['password']}
                        required
                        // hasFeedback
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data) {
                                        if (getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(new Error('Mật khẩu xác nhận đã nhập không khớp'));
                                        }
                                    } else {
                                        return Promise.reject(new Error('Mật khẩu xác nhận không để trống'));
                                    }
                                },
                            }),
                        ]}>
                        <Input.Password placeholder='Mật khẩu xác nhận' size='large' />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'end' }}>
                        <Link to="/login">Đã có tài khoản?</Link>
                    </Form.Item>
                    <Form.Item
                        // {...tailFormItemLayout}
                        style={{ textAlign: 'center' }}
                    >
                        <Button size='large' type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Spin>
            </Form >
        </div>
    );
};
export default SignUp;