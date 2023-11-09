import React from 'react';
import classNames from 'classnames/bind';
import BodyMessageChat from '../BodyMessageChat';
import InputMessageChat from '../InputMessageChat';
import HeaderMessageChat from '../HeaderMessageChat';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import { Layout } from 'antd';

///
const cx = classNames.bind(styles);
///

const LayoutMessageChat = (props) => {
    const {
        conversationSelected,
        messages,
        lastTimeOnline
    } = props.propsMessageChat

    return (
        <>
            <Layout className={cx('layout-chat-message')}>
                {
                    conversationSelected ? (<>
                        <HeaderMessageChat conversationSelected={conversationSelected} lastTimeOnline={lastTimeOnline} />
                        <BodyMessageChat messages={messages}
                            conversationSelected={conversationSelected} />
                        <InputMessageChat conversationSelected={conversationSelected} />
                    </>) : (<></>)
                }
            </Layout>

        </>

    )
}

export default LayoutMessageChat;