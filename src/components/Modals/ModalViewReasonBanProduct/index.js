import React, { useState } from "react";
import { Button, Modal, Divider } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { ParseDateTime } from "~/utils";

function ModalViewReasonBanProduct({ content, BanDate }) {

    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <Button
                type="primary" danger
                onClick={() => setOpenModal(true)}
            >
                Chi tiết
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Thông tin sản phẩm bị cấm</>}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                width={"40%"}
                footer={
                    <Button onClick={() => setOpenModal(false)}>Đóng</Button>
                }
            >
                <Divider />
                <div>
                    <p>Thời gian cấm:<b> {ParseDateTime(BanDate)}</b></p>
                    <p style={{ color: "red" }}>Nguyên nhân:</p>
                    {content}
                </div>
            </Modal>
        </>
    );
}

export default ModalViewReasonBanProduct;