import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import ConversationFormated from './ConversationFormated';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuthUser } from 'react-auth-kit';
import { Layout, List, Card, Typography } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ, MESSAGE_TYPE_CONVERSATION_IMAGE, MESSAGE_TYPE_CONVERSATION_TEXT } from '~/constants';

///
const cx = classNames.bind(styles);
///

const LayoutUserChat = ({ propsUserChat }) => {
    /// states
    const [reloadComponentFlag, setReloadComponentFlag] = useState(false);
    ///
    /// distructuring
    const { conversations,
        conversationSelected,
        updateIsReadConversation,
        setConversations,
        setConversationSelected } = propsUserChat;
    ///

    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// styles
    const bodyCardHeader = { padding: 15 }
    const styleTypography = { margin: 0 }
    const styleScrollUserChat = { height: '100%', overflow: 'auto', padding: '0 16px' }
    ///

    /// useEffects

    /// useEffect
    useEffect(() => {
        if (conversations.length === 0) return;
        const interval = setInterval(() => {
            console.log('interval user chat');
            reloadComponent();
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations, reloadComponentFlag])
    ///

    /// handles
    const handleClickUser = (conversation) => {

        //update is Read db
        if (user === undefined || user === null) return;
        var userId = user.id;

        if (conversation.isRead === USER_CONVERSATION_TYPE_UN_READ) {
            updateIsReadConversation(conversation.conversationId, USER_CONVERSATION_TYPE_IS_READ, userId);
        }

        //update new isRead state
        const newConversation = conversations.map((item) => {
            if (item.conversationId === conversation.conversationId) {

                return { ...item, isRead: USER_CONVERSATION_TYPE_IS_READ }
            }
            return item;
        })
        setConversations(newConversation)


        setConversationSelected(conversation);
    }
    ///

    ///functions
    const getFullNameUser = (users, userId) => {
        let fullName = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                fullName = users[i].fullname;
                break;
            }
        }
        return fullName;
    }

    const isLatestMessageTypeText = (latestMessage) => {
        if (!latestMessage) return;
        return latestMessage.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? true : false;
    }

    const isLatestMessageTypeImage = (latestMessage) => {
        if (!latestMessage) return;
        return latestMessage.messageType === MESSAGE_TYPE_CONVERSATION_IMAGE ? true : false;
    }

    const isYourLatestMessage = (latestMessage) => {
        if (user === null || user === undefined) return;
        if (!latestMessage) return;
        return latestMessage.userId === user.id ? true : false;
    }

    const reloadComponent = () => {
        setReloadComponentFlag(!reloadComponentFlag);
    }
    ///

    return (
        <Layout className={cx('layout-user-chat')}>
            <Card
                bordered
                bodyStyle={bodyCardHeader}>
                <Typography.Title
                    level={4}
                    style={styleTypography}
                >
                    Gần đây
                </Typography.Title>
            </Card>
            <div id="scrollUserChat" style={styleScrollUserChat}>
                <InfiniteScroll
                    dataLength={conversations.length}
                    scrollableTarget="scrollUserChat"
                >
                    <List
                        dataSource={conversations}
                        renderItem={(item) => (
                            <ConversationFormated conversation={item}
                                handleClickUser={handleClickUser}
                                conversationSelected={conversationSelected}
                                isYourLatestMessage={isYourLatestMessage}
                                isLatestMessageTypeText={isLatestMessageTypeText}
                                isLatestMessageTypeImage={isLatestMessageTypeImage}
                                getFullNameUser={getFullNameUser} />
                        )}
                    />
                </InfiniteScroll>
            </div>
        </Layout>
    )
}

export default LayoutUserChat;