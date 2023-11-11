import React, { useEffect, useState, useContext } from "react";
import ModalSend2FaQrCode from "~/components/Modals/ModalSend2FaQrCode";
import { getUserId } from '~/utils';
import { useNavigate } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { generate2FaKey, activate2Fa, deactivate2Fa } from '~/api/user';
import { getUserById, checkExistUsername, editUserInfo } from "~/api/user";
import { ExclamationCircleFilled, GooglePlusOutlined, FacebookOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Input, Space, Card, Typography, Col, Row, Form } from "antd";

import classNames from 'classnames/bind';
import styles from './Security.module.scss';
import validator from 'validator';
import { encryptPassword } from '~/utils';

const cx = classNames.bind(styles)
const { Title, Text } = Typography;

function Security() {
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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    /// contexts
    const notification = useContext(NotificationContext)
    ///


    const handleTabChange = (key) => {
        setTabKey(key);
    };

    useEffect(() => {
        if (userId === null) {
            alert("Some err!");
            return navigate("/login");
        }
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
                setUser2FaStatus(res.data.twoFactorAuthentication)
                if (res.data.username === undefined || res.data.username === "") {
                    setTabList((prev) => [...prev, { key: 'tab3', tab: 'Kích hoạt tài khoản và mật khẩu' }])
                }
            })
            .catch(() => {
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

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
                style={{
                    width: '100%',
                    marginBottom: 15
                }}
                hoverable

            >
                <Row className={cx('space-bottom-row')}>
                    <Col><Title level={5}><GooglePlusOutlined />&nbsp;&nbsp;Liên kết Google:</Title></Col>
                    <Col><Text className={cx('ml-30')}>{userInfo.email}</Text></Col>
                </Row>
            </Card>
            <Card
                style={{
                    width: '100%',
                }}
                hoverable
            >
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


    const onFinish = (values) => {
        const username = values.username;
        const newPassword = values.newPassword;
        var bodyFormData = new FormData();
        bodyFormData.append('userId', userId)
        bodyFormData.append('username', username)
        bodyFormData.append('password', encryptPassword(newPassword))

        checkExistUsername(username)
            .then((res) => {
                if (res.data === 'Y') {
                    notification("error", "Tên tài khoản đã được sử dụng, vui lòng chọn tên khác!")
                } else {
                    editUserInfo(bodyFormData)
                        .then((res) => {
                            if (res.status === 200) {
                                const data = res.data;
                                const status = data.status;
                                if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                                    notification("success", "Kích hoạt tài khoản và mật khẩu thành công!")
                                    const tabListFilter = tabList.filter(item => item.key !== 'tab3')
                                    setTabList(tabListFilter);
                                    setTabKey('tab2');
                                }
                            }
                        })
                }
            });

    };

    const onFinishFailed = (errorInfo) => {
        console.log('On finish failed at security page:', errorInfo);
    };

    const confirmPasswordValidator = (value) => {
        let newPassword = form.getFieldValue('newPassword');
        let confirmPassword = form.getFieldValue(value.field);

        newPassword = newPassword === undefined ? '' : newPassword;
        confirmPassword = confirmPassword === undefined ? '' : confirmPassword;

        if (!validator.equals(newPassword, confirmPassword)) {
            return Promise.reject('Mật khẩu không trùng khớp');
        } else {
            return Promise.resolve()

        }
    }

    const newPasswordValidator = (value) => {
        let newPassword = form.getFieldValue(value.field);
        newPassword = newPassword === undefined ? '' : newPassword;

        if (!validator.isLength(newPassword, { min: 3 })) {
            return Promise.reject('Mật khẩu không đủ mạnh. Phải có ít nhất 3 kí tự');
        } else {
            return Promise.resolve();
        }

    }

    const ActiveUsernamePassword = () => (
        <div>

            <Form
                name="basic"
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 15,
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
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Tài khoản không hợp lệ!',
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu không hợp lệ',
                        },
                        {
                            validator: newPasswordValidator
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu không hợp lệ',
                        },
                        {
                            validator: confirmPasswordValidator
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Confirm
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )



    const contentList = {
        tab1: (<AccountLogin />),
        tab2: (<TwoFactorAuthentication />),
        tab3: (<ActiveUsernamePassword />)
    };

    return (
        <>
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

        </>
    );
}

export default Security;
