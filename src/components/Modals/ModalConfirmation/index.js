import React from 'react'
import { Modal } from 'antd';

const ModelConfirmation = ({ title, isOpen, onOk, onCancel, content }) => {


    return (
        <Modal title={title} open={isOpen} onOk={onOk} onCancel={onCancel}>
            <p>{content}</p>
        </Modal>
    )
}

export default ModelConfirmation;