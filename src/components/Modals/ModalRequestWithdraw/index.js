import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Divider, notification, Modal, Button, Input } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { createWithdrawTransaction } from "~/api/bank";
import { getCustomerBalance } from '~/api/user'

function ModalRequestWithdraw({ userId }) {

    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [amount, setAmount] = useState("10000");
    const [message, setMessage] = useState("");
    const [customerBalance, setCustomerBalance] = useState(0)

    useLayoutEffect(() => {
        if (userId === null) {
            openNotification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
        }
        getCustomerBalance(userId)
            .then((res) => {
                setCustomerBalance(res.data)
            })
            .catch((err) => {
                openNotification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const handleSubmit = () => {

        if (amount < 10000) {
            alert("Số tiền bạn muốn nạp không hợp lệ!")
            return;
        }
        if (amount > customerBalance) {
            alert("Số tiền bạn muốn nạp không hợp lệ!")
            return;
        }
        const data = {
            userId,
            amount
        }
        setConfirmLoading(true);
        createWithdrawTransaction(data)
            .then((res) => {
                console.log(res)
                setOpenModal(false)
                openNotification("success", "Tạo yêu cầu rút tiền thành công!")
                window.location.reload();
            })
            .catch(() => {
                openNotification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            }).finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false);
                }, 500);
            })
    }

    const handleInputAmount = (e) => {
        let value = e.target.value;
        setAmount(e.target.value)
        if (value < 10000) {
            setMessage("Số tiền cần phải lớn hơn hoặc bằng 10,000 VND ")
        } else if (value > 10000000) {
            setMessage("Số tiền cần phải nhỏ hơn hoặc bằng 10,000,000 VND ")
        } else {
            setMessage("")
        }
    }

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const handleOpenModal = () => {
        if (customerBalance < 10000) {
            openNotification("info", "Yêu cầu số dư trong tài khoản của bạn phải lớn hơn 10,000 VND!")
            return;
        } else {
            setOpenModal(true)
        }
    }


    return (
        <>
            {contextHolder}

            <Button
                onClick={handleOpenModal}
                type="primary"
                style={{ marginTop: "10px", marginBottom: "10px" }}
            >
                + Tạo yêu cầu rút tiền
            </Button>


            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Yêu cầu nạp tiền</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Thanh toán"}
                cancelText={"Hủy"}
                width={"30%"}
            >
                <>
                    <Divider />
                    <p>Hãy nhập số tiền bạn muồn nạp:</p>
                    <div style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px" }}>
                        <Input
                            type="number"
                            value={amount}
                            onPressEnter={handleSubmit}
                            onChange={(e) => handleInputAmount(e)}
                        />
                        <p><i style={{ color: "red" }}>{message}</i></p>
                    </div>
                    <p>
                        <b style={{ color: "red" }}>Lưu ý:</b>
                        <div style={{ marginLeft: "30px" }}>
                            <i>Số tiền tối VND a bạn có thể nạp 10,000,000 VND </i>
                            <br />
                            <i>Số tiền tối thiểu bạn có thể nạp 10,000 VND </i>
                        </div>
                    </p>
                </>

            </Modal>
        </>)
}

export default ModalRequestWithdraw;