import React, { useState, useEffect, useRef, useContext } from 'react';
import fptImage from '~/assets/images/fpt-logo.jpg';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'
import LayoutUserChat from '~/components/ChatBox/LayoutUserChat';
import LayoutMessageChat from '~/components/ChatBox/LayoutMessageChat';
import { useAuthUser } from 'react-auth-kit';
import { useLocation } from 'react-router-dom';
import { ChatContext } from "~/context/ChatContext";
import { getUserId, getVietnamCurrentTime } from '~/utils';
import { UserOnlineStatusContext } from "~/context/UserOnlineStatusContext";
import { FileImageOutlined } from '@ant-design/icons';
import { GetUsersConversation, GetMessages, sendMessage, updateUserConversation } from '~/api/chat';
import { Button, Form } from 'antd';
import { NotificationMessageContext } from "~/context/NotificationMessageContext";
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ } from '~/constants';

require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const ChatBox = () => {
    /// router
    const location = useLocation();
    let conversationIdPath = location.state?.data || null;
    ///

    /// context
    const contextData = useContext(NotificationMessageContext);
    ///

    /// variables
    const numberConversationUnRead = contextData.numberConversationUnRead;
    const setIsOpenChat = contextData.setIsOpenChat;
    ///

    /// auth
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [form] = Form.useForm();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [conversationSelected, setConversationSelected] = useState(null);
    const [lastTimeOnline, setLastTimeOnline] = useState('');
    const [reloadConversationFlag, setReloadConversationFlag] = useState(false);
    const [isUploadFile, setIsUploadFile] = useState(false);
    const messagesEndRef = useRef(null);
    const bodyMessageRef = useRef(null);
    ///



    const handleOpenUploadFile = () => {
        setIsUploadFile(!isUploadFile)
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    const uploadButton = (
        <Button type="primary" shape="circle" icon={<FileImageOutlined />} size={30} />
    );

    /// scroll
    const scrollToBottom = () => {
        if (bodyMessageRef.current && messagesEndRef.current) {
            const bodyMessageElement = bodyMessageRef.current;
            const messagesEndElement = messagesEndRef.current;

            bodyMessageElement.scrollTop = messagesEndElement.offsetTop;
        }
    };
    ///

    useEffect(scrollToBottom, [messages]);

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

    const handleReloadNumberConversation = () => {
        if (contextData) {
            const reloadNumberConversation = contextData.reloadNumberConversation;
            reloadNumberConversation();
        }
    }

    const handleAddOneNumberConversation = () => {
        if (contextData) {
            const addOneNumberConversation = contextData.addOneNumberConversation;
            addOneNumberConversation();
        }
    }

    const handleMinusOneNumberConversation = () => {
        if (contextData) {
            const minusOneNumberConversation = contextData.minusOneNumberConversation;
            minusOneNumberConversation();
        }
    }

    const onFinish = (values) => {
        if (user === null || user === undefined) return;
        const { fileUpload } = values;
        if ((newMessage === undefined || newMessage.length === 0) && fileUpload === undefined) return;
        const currentTime = getVietnamCurrentTime();

        var bodyFormData = new FormData();
        bodyFormData.append('conversationId', conversationSelected.conversationId);
        bodyFormData.append('UserId', user.id);
        bodyFormData.append('content', newMessage);
        for (var i = 0; i < fileUpload?.length || 0; i++) {
            bodyFormData.append('Images', fileUpload[i].originFileObj);
        }
        for (var j = 0; j < conversationSelected.users.length || 0; j++) {
            bodyFormData.append('RecipientIds', conversationSelected.users[j].userId);
        }
        bodyFormData.append('dateCreate', currentTime);

        sendMessage(bodyFormData)
            .then((res) => {
                if (res.status === 200) {
                    form.resetFields();
                    setIsUploadFile(false);
                    setNewMessage('');
                }
            })
            .catch(error => {
                console.error(error);
            });

    };

    const updateIsReadConversation = (ConversationId, IsRead, UserId) => {
        const dataUpdate = {
            ConversationId: ConversationId,
            IsRead: IsRead,
            UserId: UserId,
        }
        // update isRead user conversation
        updateUserConversation(dataUpdate)
            .then((res) => {
                if (res.status === 200) {
                    handleReloadNumberConversation();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    const handleClickUser = (conversation) => {

        //update is Read db
        var userId = getUserId();
        if (userId === undefined || userId === null) return;

        if (conversation.isRead === USER_CONVERSATION_TYPE_UN_READ) {
            // update icon header
            handleMinusOneNumberConversation();
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

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }
    ///


    /// interval
    const intervalTime = () => {

        if (conversationSelected === null || conversationSelected === undefined) return;
        const interval = setInterval(() => {
            if (conversationSelected.isGroup === false) {
                setLastTimeOnline(moment(conversationSelected.lastTimeOnline).fromNow());
            }
        }, 60000);
        return () => clearInterval(interval);
    }

    intervalTime();
    ///

    /// useEffects
    useEffect(() => {
        if (conversationSelected === null || conversationSelected === undefined) return;
        // if (reloadMessageFlag) return;

        // setReloadMessageFlag(true);

        GetMessages(conversationSelected.conversationId)
            .then((response) => {
                const messages = response.data

                // set avt default for empty avt
                const newMessages = messages.map((message) => {
                    if (message.avatar.length === 0) {
                        return { ...message, avatar: fptImage }
                    }
                    return message;
                })

                setMessages(newMessages)
            })
            .catch((error) => {
                console.log(error);
            })
        // .finally(() => {
        //     setReloadMessageFlag(false);
        // })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected])

    // update Notification message
    useEffect(() => {
        setIsOpenChat(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // get conversations
    useEffect(() => {
        if (user === null || user === undefined) return;

        const loadConversations = () => {
            GetUsersConversation(user.id)
                .then((response) => {
                    const conversations = response.data

                    // set avt default for empty avt
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

                    // sort conversation by message creation date 
                    const conversationSorted = sortConversationByMessageCreationDate(newConversation);

                    // update conversations
                    setConversations(conversationSorted);

                    if (conversationIdPath) {
                        const conversationFilter = newConversation.find(c => c.conversationId === conversationIdPath);
                        setConversationSelected(conversationFilter)
                    }
                })
                .catch((errors) => {
                    console.log(errors)
                });

        };

        loadConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadConversationFlag]);


    // message from signR
    const message = useContext(ChatContext);

    useEffect(() => {

        const setMessage = () => {
            if (message) {
                if ('messageId' in message) {
                    const currentDate = new Date();
                    const userId = +getUserId()
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
                                    // update icon header
                                    if (numberConversationUnRead > 0) {
                                        handleMinusOneNumberConversation();
                                    }

                                    // update isRead conversation 
                                    // update db
                                    updateIsReadConversation(conversationSelected.conversationId, USER_CONVERSATION_TYPE_IS_READ, userId);

                                    // update UI
                                    return { ...item, latestMessage: { content: message.content, dateCreate: currentDate }, isRead: USER_CONVERSATION_TYPE_IS_READ }
                                } else {
                                    // update icon header
                                    if (item.isRead === USER_CONVERSATION_TYPE_IS_READ) {
                                        handleAddOneNumberConversation();
                                    }
                                    return { ...item, latestMessage: { content: message.content, dateCreate: currentDate }, isRead: USER_CONVERSATION_TYPE_UN_READ }
                                }

                            } else {
                                return { ...item, latestMessage: { content: message.content, dateCreate: currentDate }, isRead: USER_CONVERSATION_TYPE_IS_READ }
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

    const setDefaultLastTime = () => {
        setLastTimeOnline('')
    }


    // user online status
    const userOnlineStatusContext = useContext(UserOnlineStatusContext);

    useEffect(() => {
        const setOnlineStatus = () => {
            if (userOnlineStatusContext) {
                setDefaultLastTime();
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




    const propsMessageChat = {
        conversationSelected: conversationSelected,
        messages: messages,
        messagesEndRef: messagesEndRef,
        form: form,
        onFinish: onFinish,
        uploadButton: uploadButton,
        newMessage: newMessage,
        handleChangeNewMessage: handleChangeNewMessage,
        normFile: normFile,
        isUploadFile: isUploadFile,
        handleOpenUploadFile: handleOpenUploadFile,
        lastTimeOnline: lastTimeOnline,
        bodyMessageRef: bodyMessageRef
    }

    return (
        <div className={cx('container')}>
            <LayoutUserChat
                userChats={conversations}
                handleClickUser={handleClickUser}
                conversationSelected={conversationSelected} />
            <LayoutMessageChat propsMessageChat={propsMessageChat} />
        </div>

    );
}

export default ChatBox;


