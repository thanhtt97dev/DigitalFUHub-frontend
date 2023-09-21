import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Divider, notification, Modal, Input, Space, Card, Typography, Col, Row } from "antd";

import { getUserById } from "~/api/user";
import { getUserId } from '~/utils';
import { ExclamationCircleFilled } from "@ant-design/icons";

import { generate2FaKey, activate2Fa, deactivate2Fa } from '~/api/user'
import ModalSend2FaQrCode from "~/components/Modals/ModalSend2FaQrCode";

import classNames from 'classnames/bind';
import styles from './Security.module.scss';

const cx = classNames.bind(styles)
const { Title, Text } = Typography;

function Security() {

    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
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

    const handleTabChange = (key) => {
        setTabKey(key);
    };

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
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
                });
                setUser2FaStatus(res.data.twoFactorAuthentication)
            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
                openNotification("success", "Kích hoạt bảo mật hai lớp thành công!")
                resetVariable();
                setUser2FaStatus(true)
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 409) {
                    setmesage2FA("Mã code không hợp lệ!")
                    return;
                }
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
                openNotification("success", "Tắt bảo mật hai lớp thành công!")
                setUser2FaStatus(false)
                resetVariable();
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 409) {
                    setmesage2FA("Mã code không hợp lệ!")
                    return;
                }
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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



    const tabList = [
        {
            key: 'tab1',
            tab: 'Liên kết tài khoản',
        },
        {
            key: 'tab2',
            tab: 'Bảo mật hai lớp',
        },
    ];



    const contentList = {
        tab1: (<div className="accountLogin">
            <Card
                style={{
                    width: '100%',
                }}
            >
                <Row className={cx('space-bottom-row')}>
                    <Col><Title level={5}>Liên kết Google:</Title></Col>
                    <Col><Text className={cx('ml-30')}>{userInfo.email}</Text></Col>
                </Row>
                <Row className={cx('space-bottom-row')}>
                    <Col><Title level={5}>Liên kết Facebook:</Title></Col>
                    <Col><Button type="primary" disabled className={cx('style-button')}>Liên kết</Button></Col>
                </Row>
            </Card>

        </div>),
        tab2: (<div className="twoFactorAuthentication">
            <Card
                style={{
                    width: '100%',
                }}
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


        </div>),
    };

    return (
        <>
            {contextHolder}
            <Card
                style={{
                    width: '100%',
                }}
                tabList={tabList}
                activeTabKey={tabKey}
                onTabChange={handleTabChange}
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
