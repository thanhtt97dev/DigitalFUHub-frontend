import React from 'react';
import { Button, Modal } from 'antd';

const ModalAlert = ({ isOpen, handleOk, content }) => (
    <Modal
        open={isOpen}
        closable={false}
        maskClosable={false}
        footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
                OK
            </Button>,
        ]}
    >
        <p>{content}</p>
    </Modal>
)

export default ModalAlert;