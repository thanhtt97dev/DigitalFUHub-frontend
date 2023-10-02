import React, { useLayoutEffect, useState } from "react";
import { Divider, notification, Modal, Button, Input } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { createWithdrawTransaction, getUserBankAccount } from "~/api/bank";
import { getCustomerBalance } from '~/api/user'

function ModalRequestWithdraw({ userId, text, style, callBack }) {

    const [api, contextHolder] = notification.useNotification();

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)

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
            return;
        }
        if (amount > customerBalance) {
            setMessage("Số dư không đủ!")
            return;
        }
        const data = {
            userId,
            amount
        }
        setConfirmLoading(true);
        createWithdrawTransaction(data)
            .then((res) => {
                setOpenModal(false)
                openNotification("success", "Tạo yêu cầu rút tiền thành công!")
                //window.location.reload();
            })
            .catch(() => {
                openNotification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            }).finally(() => {
                setTimeout(() => {
                    callBack();
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
            setMessage("Số tiền cần phải nhỏ hơn hoặc bằng 1,000,000 VND ")
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
        setBtnLoading(true)
        //checking user has been linked bank account
        getUserBankAccount(userId)
            .then((res) => {
                if (!res.data.status.ok) {
                    openNotification("info", "Bạn chưa thực hiện liên kết tài khoản ngân hàng với DigitalFUHub!")
                } else {
                    setOpenModal(true)
                }
            })
            .catch(() => {
                openNotification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            })
            .finally(() => {
                setTimeout(() => { setBtnLoading(false) }, 500)
            })
    }


    return (
        <>
            {contextHolder}

            <Button
                onClick={handleOpenModal}
                type="primary"
                style={style}
                loading={btnLoading}
            >
                {text === undefined ? "+ Tạo yêu cầu rút tiền" : text}
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Yêu cầu rút tiền</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"35%"}
            >
                <>
                    <Divider />
                    <p>Hãy nhập số tiền bạn muồn rút:</p>
                    <div style={{ textAlign: "center", margin: "0 auto", marginBottom: "10px" }}>
                        <Input
                            type="number"
                            value={amount}
                            onPressEnter={handleSubmit}
                            onChange={(e) => handleInputAmount(e)}
                        />
                        <p style={{ color: "red" }}>{message}</p>
                    </div>
                    <div>
                        <b style={{ color: "red" }}>Chú ý:</b>
                        <div style={{ marginLeft: "30px" }}>
                            <i>Số tiền tối đa bạn có thể rút trong 1 yêu cầu 1,000,000 VND </i>
                            <br />
                            <i>Số tiền tối thiểu bạn có thể rút trong 1 yêu cầu 10,000 VND </i>
                        </div>
                    </div>
                </>

            </Modal>
        </>)
}

export default ModalRequestWithdraw;