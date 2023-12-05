import React, { useEffect, useState, useContext } from "react";
import Spinning from "~/components/Spinning";
import ChangePassword from "~/components/Security";
import ModalSend2FaQrCode from "~/components/Modals/ModalSend2FaQrCode";
import { getUserId } from '~/utils';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Button, Divider, Modal, Input, Space, Card, Typography, Col, Row, Form } from "antd";
import { ExclamationCircleFilled, GooglePlusOutlined, FacebookOutlined } from "@ant-design/icons";
import { generate2FaKey, activate2Fa, deactivate2Fa, getUserById, activeUserNameAndPassword, changePassword } from '~/api/user';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_USER_USERNAME_ALREADY_EXISTS, REGEX_USERNAME_SIGN_UP, REGEX_PASSWORD_SIGN_UP, RESPONSE_CODE_USER_USERNAME_PASSWORD_NOT_ACTIVE, RESPONSE_CODE_USER_PASSWORD_OLD_INCORRECT } from '~/constants';

import classNames from 'classnames/bind';
import styles from './Security.module.scss';
import validator from 'validator';
import { encryptPassword } from '~/utils';

const cx = classNames.bind(styles)
const { Title, Text } = Typography;

function Security() {
    /// variables
    const auth = useAuthUser();
    const user = auth();
    const initialTabList = [
        {
            key: 'tab1',
            tab: 'Liên kết tài khoản',
        },
        {
            key: 'tab2',
            tab: 'Bảo mật hai lớp',
        }
    ];
    ///

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [reloadUserInfoFlag, setReloadUserInfoFlag] = useState(false);
    const [isSpinningPage, setIsSpinningPage] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const userId = getUserId();
    const [userInfo, setUserInfo] = useState({});

    const [srcQrCode2Fa, setsrcQrCode2Fa] = useState("");

    const [openModalActivate2FA, setOpenModalActivate2FA] = useState(false);
    const [openModalDeactive2FA, setOpenModalDeactive2FA] = useState(false);

    const [user2FaStatus, setUser2FaStatus] = useState(false)
    const [secretKey2FA, setSecretKey2FA] = useState("");
    const [code2FA, setCode2FA] = useState("");
    const [mesage2FA, setmesage2FA] = useState("");

    const [tabKey, setTabKey] = useState('tab1');
    const [tabList, setTabList] = useState(initialTabList);

    const [form] = Form.useForm();
    const [formChangePassword] = Form.useForm();

    /// contexts
    const notification = useContext(NotificationContext)
    ///


    const handleTabChange = (key) => {
        setTabKey(key);
    };

    useEffect(() => {
        if (userId === null) return navigate("/login");

        setIsSpinningPage(true);

        getUserById(userId)
            .then((res) => {
                setUserInfo({
                    userId: res.data.userId,
                    email: res.data.email,
                    roleName: res.data.roleName,
                    twoFactorAuthentication: res.data.twoFactorAuthentication,
                    status: res.data.status,
                    username: res.data.username
                });
                setUser2FaStatus(res.data.twoFactorAuthentication);
                const newTabList = [...tabList.filter(x => !['tab3', 'tab4'].includes(x.key))]
                if (!res.data.isChangeUsername) {
                    setTabList([...newTabList, { key: 'tab3', tab: 'Kích hoạt tài khoản và mật khẩu' }]);
                } else {
                    setTabList([...newTabList, { key: 'tab4', tab: 'Thay đổi mật khẩu' }]);
                }

                setIsSpinningPage(false);
            })
            .catch(() => {
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, reloadUserInfoFlag])

    const handleActivate2FA = () => {
        setLoading(true)
        generate2FaKey(userId)
            .then((res) => {
                setsrcQrCode2Fa(res.data.qrCode);
                setSecretKey2FA(res.data.secretKey)
                setOpenModalActivate2FA(true);
            })
            .catch(() => {
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            })
    }

    const handleSubmitActive2FA = () => {
        const data = {
            SecretKey: secretKey2FA,
            Code: code2FA
        }
        setConfirmLoading(true)
        activate2Fa(userId, data)
            .then((res) => {
                setOpenModalActivate2FA(false);
                notification("success", "Kích hoạt bảo mật hai lớp thành công!")
                resetVariable();
                setUser2FaStatus(true)
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 409) {
                    setmesage2FA("Mã code không hợp lệ!")
                    return;
                }
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false);
                }, 500);
            })
    }

    const handleCancelModalActivate2FA = () => {
        setOpenModalActivate2FA(false);
        resetVariable();
    }

    const handleDeactivate2FA = () => {
        setOpenModalDeactive2FA(true)
    }

    const handleSubmitDeactivate2FA = () => {
        const data = { Code: code2FA }
        setConfirmLoading(true)
        deactivate2Fa(userId, data)
            .then((res) => {
                setOpenModalDeactive2FA(false)
                notification("success", "Tắt bảo mật hai lớp thành công!")
                setUser2FaStatus(false)
                resetVariable();
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 409) {
                    setmesage2FA("Mã code không hợp lệ!")
                    return;
                }
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false);
                }, 500);
            })
    }

    const handleCancleModalDeactivate2FA = () => {
        setOpenModalDeactive2FA(false);
        resetVariable();
    }

    const resetVariable = () => {
        setCode2FA("")
        setSecretKey2FA("")
        setmesage2FA("");
    }

    const AccountLogin = () => (
        <div className="accountLogin">
            <Card
                style={{ width: '100%', marginBottom: 15 }} hoverable>
                <Row className={cx('space-bottom-row')}>
                    <Col><Title level={5}><GooglePlusOutlined />&nbsp;&nbsp;Liên kết Google:</Title></Col>
                    <Col><Text className={cx('ml-30')}>{userInfo.email}</Text></Col>
                </Row>
            </Card>
            <Card
                style={{ width: '100%' }} hoverable>
                <Row className={cx('space-bottom-row')}>
                    <Col><Title level={5}><FacebookOutlined />&nbsp;&nbsp;Liên kết Facebook:</Title></Col>
                    <Col><Button type="primary" disabled className={cx('style-button')}>Liên kết</Button></Col>
                </Row>
            </Card>
        </div>
    )

    const TwoFactorAuthentication = () => (
        <div className="twoFactorAuthentication">
            <Card
                style={{
                    width: '100%',
                }}
                hoverable
            >
                <Row style={{ marginBottom: '5vh' }}>
                    <Col><Title level={5}>Kích hoạt bảo mât hai lớp:</Title></Col>
                    <Col>
                        {user2FaStatus ?
                            <div>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={handleDeactivate2FA}
                                        style={{ background: "#c00" }}
                                        className={cx('style-button')}
                                    >
                                        Tắt bảo mật hai lớp
                                    </Button>
                                    <ModalSend2FaQrCode userId={userId} />
                                </Space>
                            </div>
                            :
                            <div>
                                <Button
                                    type="primary"
                                    onClick={handleActivate2FA}
                                    style={{ background: "#28a745" }}
                                    loading={loading}
                                    className={cx('style-button')}
                                >
                                    Kích hoạt
                                </Button>
                            </div>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            <li><Text strong italic>Bật bảo mật hai lớp bằng code 2FA cho tài khoản của bạn</Text>.</li>
                            <li><Text strong italic>Mỗi khi đăng nhập hệ thống sẽ yêu cầu 1 mã 6 số được tạo từ chuỗi 2FA. Đề phòng trường hợp bạn bị lộ tài khoản và mật khẩu.</Text></li>
                        </p>
                    </Col>

                </Row>

            </Card>


        </div>
    )


    /// handles
    const onChangePasswordFinish = (values) => {
        if (user === undefined || user === null) return navigate('/login');

        setIsSpinningPage(true);

        const { oldPassword, newPassword } = values;

        const dataRequest = {
            UserId: user.id,
            OldPassword: encryptPassword(oldPassword),
            NewPassword: encryptPassword(newPassword)
        }

        changePassword(dataRequest)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        formChangePassword.resetFields();
                        notification("success", "Thay đổi mật khẩu thành công");
                    } else if (status.responseCode === RESPONSE_CODE_USER_USERNAME_PASSWORD_NOT_ACTIVE) {
                        notification("error", "Bạn chưa kích hoạt đăng nhập bằng tài khoản và mật khẩu");
                        reloadUserInfo();
                    } else if (status.responseCode === RESPONSE_CODE_USER_PASSWORD_OLD_INCORRECT) {
                        notification("error", "Mật khẩu cũ không chính xác");
                    } else {
                        notification("error", "Có lỗi xảy ra, vui lòng thử lại sau");
                    }
                } else {
                    notification("error", "Có lỗi xảy ra, vui lòng thử lại sau");
                }
            })
            .catch(() => { notification("error", "Có lỗi xảy ra, vui lòng thử lại sau"); })
            .finally(() => {
                setTimeout(() => {
                    setIsSpinningPage(false);
                }, 500);
            })
    }

    const reloadUserInfo = () => {
        setReloadUserInfoFlag(!reloadUserInfoFlag);
    }

    const onFinish = (values) => {

        if (user === undefined || user === null) {
            return navigate('/login');
        }

        setIsSpinningPage(true);

        // check UserName availability
        const requestData = {
            UserId: user.id,
            Username: values.username,
            Password: encryptPassword(values.password)
        }

        activeUserNameAndPassword(requestData)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {

                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            notification("success", "Kích hoạt tài khoản và mật khẩu thành công!");
                            reloadUserInfo();
                            setTabKey('tab1');
                        } else {
                            notification("error", "Tên tài khoản đã được sử dụng, vui lòng chọn tên khác")
                        }
                    } else if (status.responseCode === RESPONSE_CODE_USER_USERNAME_ALREADY_EXISTS) {
                        notification("error", "Tên tài khoản đã được sử dụng, vui lòng chọn tên khác");
                    } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification("error", "Có lỗi xảy ra");
                    }

                    setIsSpinningPage(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const onFinishFailed = (errorInfo) => {
        console.log('On finish failed at security page:', errorInfo);
    };
    ///


    /// validators
    const confirmPasswordValidator = (value) => {
        let newPassword = form.getFieldValue('password');
        let confirmPassword = form.getFieldValue(value.field);

        if (!validator.equals(newPassword, confirmPassword)) {
            return Promise.reject('Mật khẩu không trùng khớp');
        } else {
            return Promise.resolve()

        }
    }

    const passwordValidator = (value) => {
        let password = form.getFieldValue(value.field);

        if (!validator.matches(password, REGEX_PASSWORD_SIGN_UP)) {
            return Promise.reject('Mật khẩu chứa ít nhất một kí tự hoa, 1 kí tự thường, 1 kí tự số và có độ dài 8 - 16 kí tự và không chứa các kí tự đặc biệt');
        } else {
            return Promise.resolve();
        }

    }

    const usernameValidator = (value) => {
        let username = form.getFieldValue(value.field);

        if (!validator.matches(username, REGEX_USERNAME_SIGN_UP)) {
            return Promise.reject('Tên tài khoản phải bắt đầu với kí tự chữ thường và có độ dài 6 - 12 ký tự');
        } else {
            return Promise.resolve();
        }

    }
    ///

    const ActiveUsernamePassword = () => (
        <Form
            name="basic"
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 14,
            }}
            style={{
                maxWidth: '100vh',
                margin: '0 auto',
                marginTop: 30
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            form={form}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Tài khoản"
                name="username"
                rules={[
                    {
                        validator: usernameValidator
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                    {
                        validator: passwordValidator
                    }
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                rules={[
                    {
                        validator: confirmPasswordValidator
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
                    Kích hoạt
                </Button>
            </Form.Item>
        </Form>
    )



    const contentList = {
        tab1: (<AccountLogin />),
        tab2: (<TwoFactorAuthentication />),
        tab3: (<ActiveUsernamePassword />),
        tab4: (<ChangePassword onChangePasswordFinish={onChangePasswordFinish}
            formChangePassword={formChangePassword} />)
    };

    return (<>
        <Spinning spinning={isSpinningPage}>
            <Card
                style={{
                    width: '100%',
                }}
                tabList={tabList}
                activeTabKey={tabKey}
                onTabChange={handleTabChange}
                type="inner"

            >
                {contentList[tabKey]}
            </Card>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Bảo mật hai lớp</>}
                centered
                open={openModalActivate2FA}
                onOk={handleSubmitActive2FA}
                onCancel={handleCancelModalActivate2FA}
                confirmLoading={confirmLoading}
                okText={"Đồng ý"}
                cancelText={"Đóng"}
                width={400}
            >
                <Divider />
                <h3 className={cx('text-center')}>
                    Sử dụng app Google Authenticator trên điện thoại của bạn và quét mã này
                </h3>
                <div className={cx('text-center')}>
                    <img src={srcQrCode2Fa} alt="QR Code for two-factor authentication" />
                </div>
                <Divider />
                <p className={cx('text-center')}>Hãy nhập mã code trước khi xác nhận!</p>
                <Input value={code2FA} maxLength={6} onChange={(e) => setCode2FA(e.target.value)} />
                <div className={cx('text-center')}>
                    <i className={cx('text-message-err')}>{mesage2FA}</i>
                </div>
            </Modal>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Tắt bảo mật hai lớp</>}
                centered
                open={openModalDeactive2FA}
                onOk={handleSubmitDeactivate2FA}
                onCancel={() => handleCancleModalDeactivate2FA(false)}
                confirmLoading={confirmLoading}
                okText={"Đồng ý"}
                cancelText={"Đóng"}
                width={400}
            >
                <Divider />
                <p style={{ textAlign: "center", width: "70%", margin: "0 auto", marginBottom: "10px" }}>
                    Hãy nhập mã code nếu bạn đã chắc chắn muốn tắt bảo mật hai lớp!
                </p>
                <Input value={code2FA} maxLength={6} onChange={(e) => setCode2FA(e.target.value)} />
                <div className={cx('text-center')}>
                    <i className={cx('text-message-err')}>{mesage2FA}</i>
                </div>
            </Modal>
        </Spinning>
    </>
    );
}

export default Security;
