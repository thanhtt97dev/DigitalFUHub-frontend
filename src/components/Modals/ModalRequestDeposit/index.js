import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Divider, notification, Modal, Button, Input } from "antd";

import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";

import { createDepositTransaction } from "~/api/bank";

import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_BANK_CUSTOMER_REQUEST_DEPOSIT_EXCEEDED_REQUESTS_CREATED
} from "~/constants";

function ModalRequestDeposit({ userId, text, style }) {

    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [amount, setAmount] = useState("10000");
    const [message, setMessage] = useState("");

    useLayoutEffect(() => {
        if (userId === null) {
            openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const handleSubmit = () => {
        if (amount < 10000 || amount > 10000000) {
            alert("Số tiền bạn muốn nạp không hợp lệ!")
            return;

        }
        const data = {
            userId,
            amount
        }
        setConfirmLoading(true);
        createDepositTransaction(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    var data = res.data.result;
                    setOpenModal(false)
                    return navigate("/deposit", { state: { amount: data.amount, code: data.code } })
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_CUSTOMER_REQUEST_DEPOSIT_EXCEEDED_REQUESTS_CREATED) {
                    notification("error", "Xin lỗi bạn đã tạo đủ 100 yêu cầu trong ngày hôm nay! Hãy trở lại vào ngày mai nhá!")
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }

            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
            setMessage("Số tiền cần phải lớn hơn hoặc bằng 10,000 đ")
        } else if (value > 10000000) {
            setMessage("Số tiền cần phải nhỏ hơn hoặc bằng 10,000,000 đ")
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


    return (
        <>
            {contextHolder}

            <Button
                onClick={() => setOpenModal(true)}
                icon={<PlusOutlined />}
                type="primary"
            // style={style}
            >
                {text === undefined ? "Nạp tiền" : text}
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
                            <i>Số tiền tối đa bạn có thể nạp 10,000,000 đ</i>
                            <br />
                            <i>Số tiền tối thiểu bạn có thể nạp 10,000 đ</i>
                        </div>
                    </p>
                </>

            </Modal>
        </>)
}

export default ModalRequestDeposit;