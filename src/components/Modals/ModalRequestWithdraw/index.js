import React, { useState, useContext, useEffect } from "react";
import { Divider, Modal, Button, Input, Card, Space } from "antd";
import { useAuthUser } from 'react-auth-kit'

import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";

import { createWithdrawTransaction, getUserBankAccount } from "~/api/bank";
import { getCustomerBalance } from '~/api/user'
import { NotificationContext } from '~/context/UI/NotificationContext';
import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_INSUFFICIENT_BALANCE,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_REQUESTS_CREATED,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_AMOUNT_A_DAY,
    RESPONSE_CODE_BANK_SELLER_REQUEST_WITHDRAW_ACCOUNT_BALLANCE_REQUIRED,
    ACCOUNT_BALANCE_REQUIRED_FOR_SELLER,
    MIN_PRICE_CAN_WITHDRAW,
    MAX_PRICE_CAN_WITHDRAW,
    NUMBER_WITH_DRAW_REQUEST_CAN_MAKE_A_DAY,
} from '~/constants'
import { formatPrice } from "~/utils";

const styleCardItem = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
}

function ModalRequestWithdraw({ userId, text, style, callBack }) {

    const auth = useAuthUser()
    const user = auth()

    const notification = useContext(NotificationContext);
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)
    const [disableBtnSubmit, setDisableBtnSubmit] = useState(false)

    const [amount, setAmount] = useState("100000");
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
        setConfirmLoading(true)
        if (amount < MIN_PRICE_CAN_WITHDRAW) {
            setTimeout(() => { setConfirmLoading(false); }, 500);
            return;
        }
        if (amount > customerBalance) {
            setTimeout(() => { setConfirmLoading(false); }, 500);
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
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_REQUESTS_CREATED) {
                    notification("error", "Xin lỗi bạn đã tạo đủ 20 yêu cầu trong ngày hôm nay! Hãy trở lại vào ngày mai nhá!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_CUSTOMER_REQUEST_WITHDRAW_EXCEEDED_AMOUNT_A_DAY) {
                    notification("error",
                        <Space direction="vertical">
                            <span>Xin lỗi ! Hôm nay bạn đã yêu cầu rút {formatPrice(res.data.result)}!</span>
                        </Space>)
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_SELLER_REQUEST_WITHDRAW_ACCOUNT_BALLANCE_REQUIRED) {
                    notification("error", <span>Số du sau khi rút của bạn phải lớn hơn {formatPrice(ACCOUNT_BALANCE_REQUIRED_FOR_SELLER)} </span>)
                } else {
                    notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
                }
            })
            .catch(() => {
                notification("error", "Xảy ra một vài sự cố! Hãy thử lại sau!")
            }).finally(() => {
                setTimeout(() => { setConfirmLoading(false); }, 500);
                callBack();
            })
    }

    const handleInputAmount = (e) => {
        let value = e.target.value;
        setAmount(e.target.value)
        if (value < MIN_PRICE_CAN_WITHDRAW) {
            setDisableBtnSubmit(true)
            setMessage("Số tiền cần phải lớn hơn hoặc bằng 50,000 VND ")
        } else if (value > MAX_PRICE_CAN_WITHDRAW) {
            setMessage("Số tiền cần phải nhỏ hơn hoặc bằng 3,000,000 VND ")
            setDisableBtnSubmit(true)
        } else if (value > customerBalance) {
            setMessage("Số dư không đủ!")
            setDisableBtnSubmit(true)
        }
        else {
            setDisableBtnSubmit(false)
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
                icon={<PlusOutlined />}
                style={style}
                loading={btnLoading}
            >
                {text === undefined ? "Tạo yêu cầu rút tiền" : text}
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Yêu cầu rút tiền</>}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                width={"36%"}
                footer={
                    <Space>
                        <Button onClick={() => setOpenModal(false)}>Hủy</Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={disableBtnSubmit}
                            loading={confirmLoading}
                        >
                            Xác nhận
                        </Button>
                    </Space>
                }
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
                            addonAfter="VNĐ"
                        />
                        <p style={{ color: "red" }}>{message}</p>
                    </div>
                    <div>
                        <b style={{ color: "red" }}>Chú ý:</b>
                        <div style={{ marginLeft: "10px" }}>
                            <i>Số tiền bạn có thể rút trong 1 yêu cầu trong khoảng <b>50,000 - 3,000,000 VND</b></i>
                            <br />
                            <i>Một ngày bạn có thể tạo tối đa {NUMBER_WITH_DRAW_REQUEST_CAN_MAKE_A_DAY} yêu cầu rút tiền </i>
                        </div>
                    </div>
                </>

            </Modal>
        </>)
}

export default ModalRequestWithdraw;