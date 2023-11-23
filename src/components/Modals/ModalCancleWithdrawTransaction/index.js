import React, { useContext, useState } from "react";
import { } from 'react-router-dom';
import { Divider, Modal, Button, } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { cancelWithdrawTransaction } from "~/api/bank";

import {
    RESPONSE_CODE_SUCCESS,
} from "~/constants";

import { NotificationContext } from '~/context/UI/NotificationContext';

function ModalCancleWithdrawTransaction({ withdrawTransactionId, callBack }) {

    const notification = useContext(NotificationContext);
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleSubmit = () => {
        setConfirmLoading(true)
        cancelWithdrawTransaction(withdrawTransactionId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Hủy yêu cầu rút tiền thành công")
                    callBack()
                } else {
                    notification("error", "Trạng thái yêu cầu rút tiền đã được thay đổi! Vui lòng tải lại trang!")
                }
                setConfirmLoading(false)
                setOpenModal(false)
            })
            .catch((err) => {
                notification("error", "Lỗi! Vui lòng thử lại sau!")
                setConfirmLoading(false)
            })
    }

    return (
        <>

            <Button
                onClick={() => setOpenModal(true)}
                type="link"
                danger
            >
                Huỷ
            </Button>


            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Hủy yêu cầu rút tiền</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Đồng ý"}
                cancelText={"Đóng"}
                width={"30%"}
            >
                <Divider />
                <p>Bạn có chắc chắn muốn hủy yêu cầu rút tiền này không ?</p>
            </Modal>
        </>)
}

export default ModalCancleWithdrawTransaction;