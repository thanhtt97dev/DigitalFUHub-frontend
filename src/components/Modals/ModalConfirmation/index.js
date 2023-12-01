import React from 'react'
import { Modal, Button } from 'antd';
import { RollbackOutlined, CheckOutlined } from '@ant-design/icons';

const ModelConfirmation = ({ title, isOpen, onOk, onCancel, contentModal, contentButtonCancel, contentButtonOk, isLoading }) => {


    return (
        <Modal title={title}
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
            maskClosable={!isLoading}
            footer={[
                <Button icon={<RollbackOutlined />} onClick={onCancel}>
                    {contentButtonCancel}
                </Button>,
                <Button icon={<CheckOutlined />} type="primary" onClick={onOk} loading={isLoading}>
                    {contentButtonOk}
                </Button>
            ]}>
            <p>{contentModal}</p>
        </Modal>
    )
}

export default ModelConfirmation;