import { LoadingOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Spin,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { checkExistEmail, signUp, checkExistUsername } from '~/api/user';
import { encryptPassword, regexPattern } from '~/utils';
import { REGEX_PASSWORD_SIGN_UP, REGEX_USERNAME_SIGN_UP, RESPONSE_CODE_SUCCESS } from '~/constants';
import { NotificationContext } from '~/context/UI/NotificationContext';
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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
                notification("success", `Vui lòng đến "${dataBody.email}" để xác thực tài khoản.`, <b>Thông báo</b>, 5, 'center');
                return navigate('/login')
            })
            .catch(err => {
                notification("error", "Đã có lỗi xảy ra, vui lòng thử lại.")
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }
    return (
        <Spin spinning={loading} indicator={antIcon}>
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Row style={{
                    boxShadow: '0px 0px 9px 2px rgba(0,0,0,.4)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    paddingRight: '1em'
                }}>
                    <Col>
                        <img style={{ height: '100%' }} alt="" src={'https://tuyensinhdonga.edu.vn/wp-content/uploads/2021/08/nganh-thuong-mai-dien-tu.png'} />
                    </Col>
                    <Col style={{
                        marginInlineStart: '1em'
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
                            <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Đăng Ký</h4>
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
                                                const result = regexPattern(value, REGEX_USERNAME_SIGN_UP)
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
                                                    return Promise.reject(new Error('Tên tài khoản phải bắt đầu với kí tự chữ thường và có độ dài 6 - 12 ký tự'));
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
                                                const result = regexPattern(value, REGEX_PASSWORD_SIGN_UP)
                                                if (result) {
                                                    return Promise.resolve();
                                                } else {
                                                    return Promise.reject(new Error('Mật khẩu chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự và không chứa các kí tự đặc biệt'));
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

                        </Form >
                    </Col>
                </Row>
            </div>
        </Spin>
    );
};
export default SignUp;