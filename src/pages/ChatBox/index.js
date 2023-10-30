import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import fptImage from '~/assets/images/fpt-logo.jpg';
import { useAuthUser } from 'react-auth-kit';
import { useLocation } from 'react-router-dom';
import { ChatContext } from "~/context/ChatContext";
import { getUserId, getVietnamCurrentTime } from '~/utils';
import { UserOnlineStatusContext } from "~/context/UserOnlineStatusContext";
import { SendOutlined, FileImageOutlined } from '@ant-design/icons';
import { GetUsersConversation, GetMessages, sendMessage, updateUserConversation } from '~/api/chat';
import { Layout, Input, Button, Avatar, List, Card, Typography, Col, Row, Upload, Form, Image, Space } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ, MESSAGE_TYPE_CONVERSATION_TEXT } from '~/constants';

const { Meta } = Card;
const { Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

// style component
const bodyCardHeader = {
    padding: 15,
}

const styleBodyCardMessage = {
    padding: 10
}

const styleTitleMessage = {
    paddingLeft: 10
}

const styleTypography = {
    margin: 0
}

const styleMessageImage = {
    borderRadius: 5
}

//

const LayoutUserChat = ({ userChats, handleClickUser, conversationSelected }) => {

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
            <div
                id="scrollUserChat"
                style={{
                    height: '100%',
                    overflow: 'auto',
                    padding: '0 16px',

                }}
            >

                <InfiniteScroll
                    dataLength={userChats.length}
                    scrollableTarget="scrollUserChat"
                >
                    <List
                        dataSource={userChats}
                        renderItem={(item) => (
                            <List.Item onClick={() => { handleClickUser(item) }}>
                                {
                                    item.isGroup === false ? (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>

                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={item.users[0].avatar} isActive={item.isOnline} />}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={item.users[0].avatar} isActive={item.isOnline} />}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis')}>{item.latestMessage}</p>}
                                                        />
                                                    </div>)
                                            }
                                        </Card>
                                    ) : (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>
                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={fptImage} isActive={item.isOnline} />}
                                                            title={item.conversationName}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={fptImage} isActive={item.isOnline} />}
                                                            title={item.conversationName}
                                                            description={<p className={cx('text-ellipsis')}>{item.latestMessage}</p>}
                                                        />
                                                    </div>)
                                            }
                                        </Card>
                                    )
                                }

                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>

        </Layout>
    )
}

const BigUserAvatar = ({ srcAvatar, isActive }) => (
    <div className={cx('big-avatar')}>
        <Avatar size={50} src={srcAvatar} />
        {isActive ? <span className={cx('big-avatar-status')}></span> : <></>}
    </div>
)

const SmallUserAvatar = ({ srcAvatar, isActive }) => (
    <div className={cx('small-avatar')}>
        <Avatar size={40} src={srcAvatar} />
        {isActive ? <span className={cx('small-avatar-status')}></span> : <></>}
    </div>
)

const HeaderMessageChat = ({ conversationSelected, lastTimeOnline }) => (
    <Card
        bodyStyle={bodyCardHeader}>
        {
            conversationSelected.isGroup === false ? (
                <Meta
                    avatar={<BigUserAvatar srcAvatar={conversationSelected.users[0].avatar} isActive={conversationSelected.isOnline} />}
                    title={conversationSelected.users[0].fullname}
                    description={conversationSelected.isOnline ? <p>Đang hoạt động</p> : <p>Hoạt động {lastTimeOnline ? lastTimeOnline : moment(conversationSelected.lastTimeOnline).fromNow()}</p>}
                />
            ) : (
                <Meta
                    avatar={<BigUserAvatar srcAvatar={fptImage} isActive={conversationSelected.isOnline} />}
                    title={conversationSelected.conversationName}
                />
            )
        }
    </Card>
)

const styleBodyMessage = { overflowY: 'auto', maxHeight: '50vh' }

const BodyMessageChat = ({ messages, messagesEndRef, bodyMessageRef, conversationSelected }) => {
    var userId = +getUserId();
    if (userId === undefined || userId === null) return;


    /// functions
    const getFullNameUserFromConversationSelected = (userId) => {
        if (!conversationSelected) return;
        const users = conversationSelected.users;
        if (!users) return;
        const userFind = users.find(x => x.userId === userId);
        if (!userFind) return;
        return userFind.fullname;
    }

    return (
        <div style={styleBodyMessage} ref={bodyMessageRef}>
            {
                messages.map((item) => (
                    <>
                        {
                            item.userId !== userId ?
                                (<div style={{ marginBottom: 25 }}>
                                    <Space align="center">
                                        <Avatar src={item.avatar} />
                                        <Space.Compact direction="vertical">
                                            <div style={styleTitleMessage}>
                                                {conversationSelected.isGroup ? <Text type="secondary" style={{ marginBottom: 5 }}>{getFullNameUserFromConversationSelected(item.userId)}</Text> : <></>}
                                            </div>
                                            <Card className={cx('card-message')} bodyStyle={styleBodyCardMessage}>
                                                {item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? <p>{item.content}</p> : <Image style={styleMessageImage} width={150} src={item.content} />}
                                            </Card>
                                            <div style={styleTitleMessage}>
                                                <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                            </div>
                                        </Space.Compact>
                                    </Space>
                                </div>)
                                :
                                (<div style={{ marginBottom: 25, position: 'relative' }}>
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

const styleFormInputMessage = {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    marginBottom: 15
}

const InputMessageChat = ({ form,
    onFinish,
    normFile,
    uploadButton,
    newMessage,
    handleChangeNewMessage,
    isUploadFile,
    handleOpenUploadFile }) => {


    return (
        <Form
            name="control-hooks"
            form={form}
            onFinish={onFinish}
            style={styleFormInputMessage}
        >
            {
                isUploadFile ? (
                    <Row>
                        <Col span={24}>
                            <Form.Item name="fileUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload
                                    listType="picture-card"
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                ) : (<></>)}
            <Row>
                <Col span={2}>
                    <Button style={{ marginLeft: 15 }} type="primary" shape="circle" icon={<FileImageOutlined />} size={30} onClick={handleOpenUploadFile} />
                </Col>
                <Col span={22}>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleChangeNewMessage}
                        suffix={
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                htmlType="submit"
                            />
                        }
                    />
                </Col>
            </Row>
        </Form>
    )
}

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

const ChatBox = () => {
    const location = useLocation();
    let conversationIdPath = location.state?.data || null;
    const auth = useAuthUser();
    const user = auth();

    const [form] = Form.useForm();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [conversationSelected, setConversationSelected] = useState(null);
    const [lastTimeOnline, setLastTimeOnline] = useState('');
    const [reloadConversationFlag, setReloadConversationFlag] = useState(false);
    // const [reloadMessageFlag, setReloadMessageFlag] = useState(false);
    const [isUploadFile, setIsUploadFile] = useState(false);
    const messagesEndRef = useRef(null);
    const bodyMessageRef = useRef(null);

    const reloadMessages = () => {
        setReloadConversationFlag(!reloadConversationFlag);
    }

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
        updateUserConversation(dataUpdate).catch((error) => {
            console.log(error)
        })
    }


    const handleClickUser = (conversation) => {

        //update is Read db
        var userId = getUserId();
        if (userId === undefined || userId === null) return;

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

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }
    ///


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

                    //set 
                    setConversations(newConversation);
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
        const userId = +getUserId()

        const setMessage = () => {
            if (message) {
                if ('messageId' in message) {

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
                                    updateIsReadConversation(conversationSelected.conversationId, USER_CONVERSATION_TYPE_IS_READ, userId);
                                    return { ...item, latestMessage: message.content, isRead: USER_CONVERSATION_TYPE_IS_READ }
                                } else {
                                    return { ...item, latestMessage: message.content, isRead: USER_CONVERSATION_TYPE_UN_READ }
                                }

                            } else {
                                return { ...item, latestMessage: message.content, isRead: USER_CONVERSATION_TYPE_IS_READ }
                            }
                        }
                        return item;
                    })

                    // update user chat
                    setConversations(newConversations)
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

                        setConversations((prev) => [...prev, message])
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

                console.log('userOnlineStatusJson = ' + JSON.stringify(userOnlineStatusJson))
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


