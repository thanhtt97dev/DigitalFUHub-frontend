import React, { useState } from "react";
import { Divider, notification, Modal, Button } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { send2FaQrCode } from '~/api/user'

function ModalSend2FaQrCode({ userId }) {

    const [openModal, setOpenMoodal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const handleSubmit = () => {
        setConfirmLoading(true);
        send2FaQrCode(userId)
            .then(() => {
                openNotification("success", "Gửi mã QR thành công!")
                setOpenMoodal(false)
            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            }).finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false);
                }, 500);
            })
    }

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    return (
        <>
            {contextHolder}

            <Button
                onClick={() => setOpenMoodal(true)}
                type="primary"
            >
                Yêu cầu gửi lại mã QR kích hoạt
            </Button>


            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Gửi lại mã QR bảo mật hai lớp</>}
                centered
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenMoodal(false)}
                confirmLoading={confirmLoading}
                okText={"Đồng ý"}
                cancelText={"Đóng"}
                width={400}
            >
                <Divider />
                <p style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px" }}>
                    Bạn có chắc cần gửi lại QR Code này không?
                </p>
                <p>
                    <b style={{ color: "red" }}>Chú ý:</b>
                    <div style={{ marginLeft: "30px" }}>
                        <i>Chúng tôi sẽ gửi QR Code đến email của bạn!</i>
                        <br />
                        <i>Xin đùng gửi QR Code này cho ai!</i>
                    </div>
                </p>
            </Modal>
        </>)
}

export default ModalSend2FaQrCode;