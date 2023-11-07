import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss';
import fptImage from '~/assets/images/fpt-logo.jpg';
import LayoutUserChat from '~/components/ChatBox/LayoutUserChat';
import LayoutMessageChat from '~/components/ChatBox/LayoutMessageChat';
import { useAuthUser } from 'react-auth-kit';
import { useLocation } from 'react-router-dom';
import { ChatContext } from "~/context/SignalR/ChatContext";
import { UserOnlineStatusContext } from "~/context/SignalR/UserOnlineStatusContext";
import { GetConversations, GetMessages, updateUserConversation } from '~/api/chat';
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ, RESPONSE_CODE_SUCCESS } from '~/constants';

///
const cx = classNames.bind(styles);
///

const ChatBox = () => {

    /// router
    const location = useLocation();
    let conversationIdPath = location.state?.data || null;
    ///

    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [conversationSelected, setConversationSelected] = useState(null);
    ///

    ///contexts
    const userOnlineStatusContext = useContext(UserOnlineStatusContext);
    const message = useContext(ChatContext);
    ///

    /// Handles

    const sortConversationByMessageCreationDate = (conversations) => {
        const currentDate = new Date();
        const conversationSort = conversations.sort((conversationA, conversationB) => {
            const dateA = new Date(conversationA.latestMessage.dateCreate);
            const dateB = new Date(conversationB.latestMessage.dateCreate);

            const differenceA = Math.abs(currentDate - dateA);
            const differenceB = Math.abs(currentDate - dateB);

            return differenceA - differenceB;
        });
        return conversationSort;
    }

    const sortConversationByCreationDate = (conversations) => {
        const currentDate = new Date();
        const conversationSort = conversations.sort((conversationA, conversationB) => {
            const dateA = new Date(conversationA.dateCreate);
            const dateB = new Date(conversationB.dateCreate);

            const differenceA = Math.abs(currentDate - dateA);
            const differenceB = Math.abs(currentDate - dateB);

            return differenceA - differenceB;
        });

        return conversationSort;
    }

    const updateIsReadConversation = (ConversationId, IsRead, UserId) => {
        const dataUpdate = {
            ConversationId: ConversationId,
            IsRead: IsRead,
            UserId: UserId,
        }
        // update isRead user conversation
        updateUserConversation(dataUpdate)
            .catch((error) => {
                console.log(error)
            })
    }
    ///

    /// useEffects

    //get messages
    useEffect(() => {
        if (conversationSelected === null || conversationSelected === undefined) return;

        GetMessages(conversationSelected.conversationId)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const messages = data.result;

                        // set avt default for empty avt
                        const newMessages = messages.map((message) => {
                            if (message.avatar.length === 0) {
                                return { ...message, avatar: fptImage }
                            }
                            return message;
                        })

                        setMessages(newMessages);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected])

    // get conversations
    useEffect(() => {
        if (user === null || user === undefined) return;

        const loadConversations = () => {
            GetConversations(user.id)
                .then((response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        const status = data.status;
                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            const conversations = data.result;
                            // Set avt default for empty avt
                            const newConversation = conversations.map((conversation) => {
                                const newUsers = conversation.users.map((user) => {
                                    if (user.avatar.length === 0) {
                                        return { ...user, avatar: fptImage }
                                    }
                                    return user;
                                })

                                conversation.users = newUsers
                                return conversation;
                            })

                            // Sort conversation by message creation date 
                            const conversationSorted = sortConversationByMessageCreationDate(newConversation);

                            // Update conversations
                            setConversations(conversationSorted);

                            if (conversationIdPath) {
                                const conversationFilter = newConversation.find(c => c.conversationId === conversationIdPath);
                                setConversationSelected(conversationFilter)
                            }
                        }
                    }

                })
                .catch((errors) => {
                    console.log(errors)
                });

        };

        loadConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // get message from signR
    useEffect(() => {

        const setMessage = () => {
            if (message) {
                if ('messageId' in message) {
                    const currentDate = new Date();

                    if (user === null || user === undefined) return;

                    const userId = user.id;

                    //set default avatar
                    if (message.avatar === null) {
                        message.avatar = fptImage;
                    }

                    // data update message chat
                    if (conversationSelected?.conversationId === message.conversationId) {
                        setMessages((prev) => [...prev, message])
                    }

                    // data update new user chat
                    const newConversations = conversations.map((item) => {
                        if (item.conversationId === message.conversationId) {
                            if (message.userId !== userId) {
                                if (conversationSelected?.conversationId === message.conversationId) {

                                    // update isRead conversation 
                                    // update db
                                    updateIsReadConversation(conversationSelected.conversationId, USER_CONVERSATION_TYPE_IS_READ, userId);

                                    // update UI
                                    return { ...item, latestMessage: { content: message.content, dateCreate: currentDate, userId: message.userId, messageType: message.messageType }, isRead: USER_CONVERSATION_TYPE_IS_READ }
                                } else {
                                    return { ...item, latestMessage: { content: message.content, dateCreate: currentDate, userId: message.userId, messageType: message.messageType }, isRead: USER_CONVERSATION_TYPE_UN_READ }
                                }

                            } else {
                                return { ...item, latestMessage: { content: message.content, dateCreate: currentDate, userId: message.userId, messageType: message.messageType }, isRead: USER_CONVERSATION_TYPE_IS_READ }
                            }
                        }
                        return item;
                    })

                    // sort conversation by message creation date
                    const conversationSort = sortConversationByMessageCreationDate(newConversations);

                    // update user chat
                    setConversations(conversationSort)
                } else {
                    const filterUserChat = conversations.find(x => x.conversationId === message.conversationId);
                    if (!filterUserChat) {
                        //set default avatar
                        const newUsers = message.users.map((user) => {
                            if (user.avatar.length === 0) {
                                return { ...user, avatar: fptImage }
                            }
                            return user;
                        })
                        message.users = newUsers;

                        // new conversation
                        const newConversations = [...conversations, message];

                        // sort conversation by creation date
                        const conversationSort = sortConversationByCreationDate(newConversations);

                        // update user chat
                        setConversations(conversationSort)
                    }
                }
            }
        }

        setMessage();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    // user online status
    useEffect(() => {
        const setOnlineStatus = () => {
            if (userOnlineStatusContext) {
                // parse to json
                const userOnlineStatusJson = JSON.parse(userOnlineStatusContext)
                if (conversations.length === 0) return;
                // update users status conversations
                const updateUserStatusConversations = () => {
                    const findConversation = conversations.find(x => x.conversationId === userOnlineStatusJson.ConversationId);
                    if (findConversation) {
                        const lastTimeOnline = new Date();
                        const isOnline = userOnlineStatusJson.IsOnline;

                        const newConversations = conversations.map((item) => {
                            if (item.conversationId === findConversation.conversationId) {
                                return { ...findConversation, isOnline: isOnline, lastTimeOnline: lastTimeOnline }
                            }
                            return item;
                        })

                        // update conversation
                        setConversations(newConversations);



                        // update conversation selected
                        if (conversationSelected !== null && conversationSelected !== undefined && conversationSelected.conversationId === userOnlineStatusJson.ConversationId) {
                            const newConversationSelected = { ...conversationSelected, isOnline: isOnline, lastTimeOnline: lastTimeOnline };

                            // set new conversation selected
                            setConversationSelected(newConversationSelected);
                        }
                    }
                };

                // call func update
                updateUserStatusConversations();

            }
        }

        setOnlineStatus();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userOnlineStatusContext])



    /// data props
    const propsMessageChat = {
        conversationSelected: conversationSelected,
        messages: messages
    }

    const propsUserChat = {
        conversations: conversations,
        setConversations: setConversations,
        conversationSelected: conversationSelected,
        setConversationSelected: setConversationSelected,
        updateIsReadConversation: updateIsReadConversation
    }
    ///

    return (
        <div className={cx('container')}>
            <LayoutUserChat propsUserChat={propsUserChat} />
            <LayoutMessageChat propsMessageChat={propsMessageChat} />
        </div>

    );
}

export default ChatBox;


