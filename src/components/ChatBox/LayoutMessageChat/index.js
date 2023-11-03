import React from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import HeaderMessageChat from '../HeaderMessageChat';
import BodyMessageChat from '../BodyMessageChat';
import InputMessageChat from '../InputMessageChat';
import { Layout } from 'antd';

const cx = classNames.bind(styles);

const LayoutMessageChat = (props) => {
    const {
        conversationSelected,
        messages,
        styleBodyCardMessage,
        messagesEndRef,
        form,
        onFinish,
        normFile,
        uploadButton,
        newMessage,
        handleChangeNewMessage,
        isUploadFile,
        handleOpenUploadFile,
        lastTimeOnline,
        bodyMessageRef
    } = props.propsMessageChat

    return (
        <>
            <Layout className={cx('layout-chat-message')}>
                {
                    conversationSelected ? (<>
                        <HeaderMessageChat conversationSelected={conversationSelected} lastTimeOnline={lastTimeOnline} />
                        <BodyMessageChat messages={messages}
                            styleBodyCardMessage={styleBodyCardMessage}
                            conversationSelected={conversationSelected}
                            messagesEndRef={messagesEndRef}
                            bodyMessageRef={bodyMessageRef} />
                        <InputMessageChat form={form}
                            onFinish={onFinish}
                            normFile={normFile}
                            uploadButton={uploadButton}
                            newMessage={newMessage}
                            handleChangeNewMessage={handleChangeNewMessage}
                            isUploadFile={isUploadFile}
                            handleOpenUploadFile={handleOpenUploadFile} />
                    </>) : (<></>)
                }
            </Layout>

        </>

    )
}

export default LayoutMessageChat;