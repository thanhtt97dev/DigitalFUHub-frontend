import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Divider, notification, Modal, Input, Space } from "antd";

import { getUserById } from "~/api/user";
import { getUserId } from '~/utils';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

import { generate2FaKey, activate2Fa, deactivate2Fa } from '~/api/user'

function Security() {

    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const userId = getUserId();
    const [userInfo, setUserInfo] = useState({});

    const [srcQrCode2Fa, setsrcQrCode2Fa] = useState("");

    const [openModalActivate2FA, setOpenModalActivate2FA] = useState(false);
    const [openModalDeactive2FA, setOpenModalDeactive2FA] = useState(false);

    const [user2FaStatus, setUser2FaStatus] = useState(false)
    const [secretKey2FA, setSecretKey2FA] = useState("");
    const [code2FA, setCode2FA] = useState("");
    const [mesage2FA, setmesage2FA] = useState("");

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
        generate2FaKey(userId)
            .then((res) => {
                setsrcQrCode2Fa(res.data.qrCode);
                setSecretKey2FA(res.data.secretKey)
                setOpenModalActivate2FA(true);

            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
    }

    const handleSubmitActive2FA = () => {
        const data = {
            SecretKey: secretKey2FA,
            Code: code2FA
        }
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
    }

    const handleCancleModalDeactivate2FA = () => {
        setOpenModalDeactive2FA(false);
        resetVariable();
    }

    const handleResend2FA = () => {

    }

    const resetVariable = () => {
        setCode2FA("")
        setSecretKey2FA("")
        setmesage2FA("");
    }

    return (
        <>
            {contextHolder}

            <div className="accountLogin">
                <h2>Liên kết tài khoản đăng nhập</h2>
                <Divider />
                <h3>Liên kết Google</h3>
                <p style={{ marginLeft: "30px" }}>{userInfo.email}</p>
                <h3>Liên kết Facebook</h3>
                <p style={{ marginLeft: "30px" }}>Chưa liên kết tài khoản Facebook <Button type="primary" disabled>Liên kết</Button></p>
            </div>

            <div className="twoFactorAuthentication" style={{ marginTop: 40 }}>
                <h2>Xác thực dùng hai yếu tố</h2>
                <Divider />

                {user2FaStatus ?
                    <div style={{ marginLeft: "30px" }}>
                        <div>
                            <CheckCircleFilled style={{ color: "green" }} />
                            <span> Đã kích hoạt</span>
                        </div>
                        <br />
                        <Space>
                            <Button
                                type="primary"
                                onClick={handleDeactivate2FA}
                                style={{ background: "#c00" }}
                            >
                                Tắt bảo mật hai lớp
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleResend2FA}
                            >
                                Gửi lại mã QR kích hoạt
                            </Button>
                        </Space>
                    </div>
                    :
                    <div style={{ marginLeft: "30px" }}>

                        <li>Bật bảo mật hai lớp bằng code 2FA cho tài khoản của bạn.</li>
                        <li>Mỗi khi đăng nhập hệ thống sẽ yêu cầu 1 mã 6 số được tạo từ chuỗi 2FA. Đề phòng trường hợp bạn bị lộ tài khoản và mật khẩu.</li>
                        <div>
                            <CloseCircleFilled style={{ color: "red" }} />
                            <span> Chưa kích hoạt</span>
                        </div>
                        <br />
                        <Button
                            type="primary"
                            onClick={handleActivate2FA}
                            style={{ background: "#28a745" }}
                        >
                            Kích hoạt
                        </Button>
                    </div>
                }
            </div>


            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Bảo mật hai lớp</>}
                centered
                open={openModalActivate2FA}
                onOk={handleSubmitActive2FA}
                onCancel={handleCancelModalActivate2FA}
                width={400}
            >
                <Divider />
                <h3 style={{ textAlign: "center" }}>
                    Sử dụng app Google Authenticator trên điện thoại của bạn và quét mã này
                </h3>
                <div style={{ textAlign: "center" }}>
                    <img src={srcQrCode2Fa} alt="QR Code for two-factor authentication" />
                </div>
                <Divider />
                <p style={{ textAlign: "center" }}>Hãy nhập mã code trước khi xác nhận!</p>
                <Input value={code2FA} maxLength={6} onChange={(e) => setCode2FA(e.target.value)} />
                <div style={{ textAlign: "center" }}>
                    <i style={{ color: "red" }}>{mesage2FA}</i>
                </div>
            </Modal>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Tắt bảo mật hai lớp</>}
                centered
                open={openModalDeactive2FA}
                onOk={handleSubmitDeactivate2FA}
                onCancel={() => handleCancleModalDeactivate2FA(false)}
                width={400}
            >
                <Divider />
                <p style={{ textAlign: "center", width: "70%", margin: "0 auto", marginBottom: "10px" }}>
                    Hãy nhập mã code nếu bạn đã chắc chắn muốn tắt bảo mật hai lớp!
                </p>
                <Input value={code2FA} maxLength={6} onChange={(e) => setCode2FA(e.target.value)} />
                <div style={{ textAlign: "center" }}>
                    <i style={{ color: "red" }}>{mesage2FA}</i>
                </div>
            </Modal>

        </>
    );
}

export default Security;
