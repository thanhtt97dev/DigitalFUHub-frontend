import React from "react";
import validator from 'validator';
import { Button, Input, Form } from "antd";
import { REGEX_PASSWORD_SIGN_UP } from '~/constants';

const ChangePassword = ({ onChangePasswordFinish, formChangePassword, }) => {

    /// validators
    const newPasswordValidator = (value) => {
        let newPassword = formChangePassword.getFieldValue(value.field);

        if (newPassword === undefined || newPassword === "" || !validator.matches(newPassword, REGEX_PASSWORD_SIGN_UP)) {
            return Promise.reject('Mật khẩu chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự và không chứa các kí tự đặc biệt');
        } else {
            return Promise.resolve();
        }
    }

    const confirmNewPasswordValidator = (value) => {
        let newPassword = formChangePassword.getFieldValue('newPassword');
        let confirmPassword = formChangePassword.getFieldValue(value.field);
        if (confirmPassword === undefined || confirmPassword === "") return Promise.reject('Nhập lại mật khẩu mới không thể bị bỏ trống');

        if (!validator.equals(newPassword, confirmPassword)) {
            return Promise.reject('Mật khẩu không trùng khớp');
        } else {
            return Promise.resolve();
        }
    }
    ///
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form
                name="basic"
                layout="vertical"
                style={{
                    width: '50%',
                    margin: '0 auto',
                    marginTop: 30
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onChangePasswordFinish}
                form={formChangePassword}
                autoComplete="off"
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu cũ',
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    required
                    rules={[
                        {
                            validator: newPasswordValidator
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmNewPassword"
                    required
                    rules={[
                        {
                            validator: confirmNewPasswordValidator
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 11,
                        span: 13,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>);
}

export default ChangePassword;