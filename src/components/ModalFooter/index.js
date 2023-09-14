import React from "react";
import { Button, Space } from "antd";

function ModalFooter({ handleCancel, handleOke }) {
    return (
        <>
            <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" onClick={handleOke}>Đồng ý</Button>
            </Space>
        </>
    );
}

export default ModalFooter;