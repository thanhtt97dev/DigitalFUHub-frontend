import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import ConversationFormated from './ConversationFormated';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuthUser } from 'react-auth-kit';
import { getConversation } from '~/api/chat';
import { Layout, List, Card, Typography, Button } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ, ADMIN_USER_ID, RESPONSE_CODE_SUCCESS, MESSAGE_TYPE_CONVERSATION_IMAGE, MESSAGE_TYPE_CONVERSATION_TEXT } from '~/constants';
import Spinning from '~/components/Spinning';
import { useNavigate } from 'react-router-dom';
import { PhoneOutlined } from '@ant-design/icons';

///
const cx = classNames.bind(styles);
///

/// styles
const bodyCardHeader = { padding: 10 }
const styleTypography = { margin: 0 }
const styleScrollUserChat = { height: '100%', overflow: 'auto', padding: '0 16px' }
///

const LayoutUserChat = ({ propsUserChat }) => {
    /// states
    const [reloadComponentFlag, setReloadComponentFlag] = useState(false);
    const [isLoadingButtonContactAdministrator, setIsLoadingButtonContactAdministrator] = useState(false);
    const [conversationIdContactAdministrator, setConversationIdContactAdministrator] = useState(0);
    const navigate = useNavigate();
    ///

    /// distructuring
    const { conversations,
        conversationSelected,
        updateIsReadConversation,
        setConversations,
        setConversationSelected,
        reloadConversation,
        isLoadingSpinningConversations } = propsUserChat;
    ///

    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// useEffects
    useEffect(() => {
        if (conversationSelected && conversationSelected.isRead === USER_CONVERSATION_TYPE_UN_READ) {
            // update conversations
            const newConversation = conversations.map((item) => {
                if (item.conversationId === conversationSelected.conversationId) {

                    return { ...item, isRead: USER_CONVERSATION_TYPE_IS_READ }
                }
                return item;
            })
            setConversations(newConversation);

            updateIsReadConversation(conversationSelected.conversationId, USER_CONVERSATION_TYPE_IS_READ, user.id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected])

    useEffect(() => {
        if (conversationIdContactAdministrator !== 0) {
            const conversationFind = conversations.find(x => x.conversationId === conversationIdContactAdministrator);

            // set conversation selected
            if (conversationFind) {
                setConversationIdContactAdministrator(0);
                setConversationSelected(conversationFind);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations])

    useEffect(() => {
        if (conversations.length === 0) return;
        const interval = setInterval(() => {
            reloadComponent();
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations, reloadComponentFlag])
    ///

    /// handles
    const handleContactTheAdministrator = () => {
        if (user === undefined || user === null) return navigate('/login');

        setIsLoadingButtonContactAdministrator(true);

        const data = { shopId: ADMIN_USER_ID, userId: user.id }

        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setConversationIdContactAdministrator(res.data.result);
                    setIsLoadingButtonContactAdministrator(false);
                    reloadConversation();
                }
            })
            .catch(() => { })
    }

    const handleClickUser = (conversation) => {

        //update is Read db
        if (user === undefined || user === null) return navigate('/login');

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
        <Spinning spinning={isLoadingSpinningConversations} wrapperClassName={cx('custom-wrapper-conversation')}>
            <Layout className={cx('layout-user-chat')}>
                <Card
                    bordered
                    title={<Typography.Title
                        level={4}
                        style={styleTypography}
                    >
                        Gần đây
                    </Typography.Title>}
                    extra={<Button icon={<PhoneOutlined />} type="primary" ghost loading={isLoadingButtonContactAdministrator} onClick={handleContactTheAdministrator}>Liên hệ với quản trị viên</Button>}
                    bodyStyle={bodyCardHeader}>
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
        </Spinning>
    )
}

export default LayoutUserChat;