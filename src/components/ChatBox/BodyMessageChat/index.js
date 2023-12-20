import React, { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import { useAuthUser } from 'react-auth-kit';
import { EpCircleCheckFilled } from '../Icons';
import { Avatar, Card, Typography, Image, Space } from 'antd';
import { MESSAGE_TYPE_CONVERSATION_TEXT, ADMIN_ROLE_ID } from '~/constants';

///
const { Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);
///

const BodyMessageChat = ({ messages, conversationSelected }) => {
    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// refs
    const messagesEndRef = useRef(null);
    const bodyMessageRef = useRef(null);
    ///

    /// styles
    const styleBodyMessage = { overflowY: 'auto', maxHeight: '50vh' }
    const styleTitleMessage = { paddingLeft: 10 }
    const styleBodyCardMessage = { padding: 10 }
    const styleMessageImage = { borderRadius: 5 }
    ///

    ///useEffects

    useEffect(() => {
        scrollToBottom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])
    ///

    /// functions
    const getFullNameUserFromConversationSelected = (userId) => {
        if (!conversationSelected) return;
        const users = conversationSelected.users;
        if (!users) return;
        const userFind = users.find(x => x.userId === userId);
        if (!userFind) return;
        return userFind.fullname;
    }

    const getAvatarUserFromConversationSelected = (userId) => {
        if (!conversationSelected) return;
        const users = conversationSelected.users;
        if (!users) return;
        const userFind = users.find(x => x.userId === userId);
        if (!userFind) return;
        return userFind.avatar;
    }

    const scrollToBottom = () => {
        if (bodyMessageRef.current && messagesEndRef.current) {
            const bodyMessageElement = bodyMessageRef.current;
            const messagesEndElement = messagesEndRef.current;

            bodyMessageElement.scrollTop = messagesEndElement.offsetTop;
        }
    };
    ///

    return (
        <div style={styleBodyMessage} ref={bodyMessageRef}>
            {
                messages.map((item, index) => (
                    <>
                        {
                            item.userId !== user?.id ?
                                (<div style={{ marginBottom: 25 }} key={index}>
                                    <Space align="center">
                                        <Avatar src={getAvatarUserFromConversationSelected(item.userId)} />
                                        <Space direction="vertical">
                                            <div>
                                                {conversationSelected.isGroup ?
                                                    <Space align='center' size={4}>
                                                        <p className={item.roleId === ADMIN_ROLE_ID ? cx('admin-name') : cx('not-admin-name')} style={{ marginBottom: 5 }}>{getFullNameUserFromConversationSelected(item.userId)}</p>
                                                        {
                                                            item.roleId === ADMIN_ROLE_ID ? <EpCircleCheckFilled /> : <></>
                                                        }
                                                    </Space>
                                                    : <></>}
                                            </div>
                                            <Card className={cx('card-message')} bodyStyle={styleBodyCardMessage}>
                                                {item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? <p>{item.content}</p> : <Image style={styleMessageImage} width={150} src={item.content} />}
                                            </Card>
                                            <div>
                                                <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                            </div>
                                        </Space>
                                    </Space>
                                </div>)
                                :
                                (<div style={{ marginBottom: 25, position: 'relative' }} key={index}>
                                    <div className={cx('style-message-sender-1')}>
                                        <Card className={cx('card-message-sender')} bodyStyle={styleBodyCardMessage}>
                                            <Space align="center">
                                                {item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? <p className={cx('text-color-message')}>{item.content}</p> : <Image style={styleMessageImage} width={150} src={item.content} />}
                                            </Space>
                                        </Card>
                                        <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                    </div>

                                </div>)
                        }
                    </>
                ))
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

export default BodyMessageChat;