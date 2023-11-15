import React, { useLayoutEffect, useState, useContext, useEffect } from "react";
import { Divider, Modal, Button, Input, Card, Space } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { createWithdrawTransaction, getUserBankAccount } from "~/api/bank";
import { getCustomerBalance } from '~/api/user'
import { NotificationContext } from '~/context/UI/NotificationContext';
import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_INSUFFICIENT_BALANCE,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_EXCEEDED_REQUESTS_CREATED
} from '~/constants'
import { formatPrice } from "~/utils";

const styleCardItem = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
}

function ModalRequestWithdraw({ userId, text, style, callBack }) {

    const notification = useContext(NotificationContext);
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)

    const [amount, setAmount] = useState("500000");
    const [message, setMessage] = useState("");
    const [customerBalance, setCustomerBalance] = useState(0)

    useEffect(() => {
        if (userId === null) {
            notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
        }
        getCustomerBalance(userId)
            .then((res) => {
                setCustomerBalance(res.data.result)
            })
            .catch((err) => {
                notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const handleSubmit = () => {

        if (amount < 500000) {
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
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Tạo yêu cầu rút tiền thành công!")
                    setCustomerBalance(res.data.result)
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_INSUFFICIENT_BALANCE) {
                    notification("error", "Số dư không đủ!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_CUSTOMER_REQUEST_EXCEEDED_REQUESTS_CREATED) {
                    notification("error", "Xin lỗi bạn đã tạo đủ 50 yêu cầu trong ngày hôm nay! Hãy trở lại vào ngày mai nhá!")
                } else {
                    notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
                }
            })
            .catch(() => {
                notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
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
        if (value < 500000) {
            setMessage("Số tiền cần phải lớn hơn hoặc bằng 500,000 VND ")
        } else if (value > 30000000) {
            setMessage("Số tiền cần phải nhỏ hơn hoặc bằng 3,000,000 VND ")
        } else {
            setMessage("")
        }
    }


    const handleOpenModal = () => {
        setBtnLoading(true)
        //checking user has been linked bank account
        getUserBankAccount(userId)
            .then((res) => {
                if (!res.data.status.ok) {
                    notification("info", "Bạn chưa thực hiện liên kết tài khoản ngân hàng với DigitalFUHub!")
                } else {
                    setOpenModal(true)
                }
            })
            .catch(() => {
                notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            })
            .finally(() => {
                setTimeout(() => { setBtnLoading(false) }, 500)
            })
    }


    return (
        <>
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
                    <Card
                        style={styleCardItem}
                    >
                        <Space>
                            <h5>Số dư:</h5> <h3 style={{ color: "#007bff" }}>{formatPrice(customerBalance)}</h3>
                        </Space>
                    </Card>
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
                            <i>Số tiền tối đa bạn có thể rút trong 1 yêu cầu 3,000,000 VND </i>
                            <br />
                            <i>Số tiền tối thiểu bạn có thể rút trong 1 yêu cầu 500,000 VND </i>
                        </div>
                    </div>
                </>

            </Modal>
        </>)
}

export default ModalRequestWithdraw;