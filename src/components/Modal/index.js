import React from 'react'
import { Modal } from 'antd';

const ModelDefault = ({ data: {
    title,
    content,
    handleOpenModal,
    openModal,
    action,
} }) => {


    return (
        <>
            <Modal title={title} open={openModal} onOk={() => { action(); handleOpenModal(); }} onCancel={handleOpenModal}>
                <p>{content}</p>
            </Modal>
        </>
    )
}

export default ModelDefault