import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { useLocation } from 'react-router-dom';
import { getOnlineStatusUser } from '~/api/user';
import { ChatContext } from "~/context/ChatContext";
import { getUserId, getVietnamCurrentTime } from '~/utils';
import { UserOnlineStatusContext } from "~/context/UserOnlineStatusContext";
import { SendOutlined, FileImageOutlined, TeamOutlined } from '@ant-design/icons';
import { GetUsersConversation, GetMessages, sendMessage, updateUserConversation } from '~/api/chat';
import { Layout, Input, Button, Avatar, List, Card, Typography, Col, Row, Upload, Form, Image, Badge } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ, USER_CONVERSATION_TYPE_IS_READ, MESSAGE_TYPE_CONVERSATION_TEXT } from '~/constants';

const { Meta } = Card;
const { Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const bodyCardHeader = {
    padding: 15,
}

const styleBodyCardMessage = {
    padding: 16
}

const LayoutUserChat = ({ userChats, handleClickUser, conversationSelected }) => {

    return (
        <Layout className={cx('layout-user-chat')}>
            <Card
                bordered
                className={cx('card-header')}
                bodyStyle={bodyCardHeader}>
                <Typography.Title
                    level={4}
                    style={{
                        margin: 0,
                    }}
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
                                    item.users.length === 1 ? (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>

                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<Badge status="success" dot={item.users[0].isOnline}><Avatar src={item.users[0].avatar} /></Badge>}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<Badge status="success" dot={item.users[0].isOnline}><Avatar src={item.users[0].avatar} /></Badge>}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis')}>{item.latestMessage}</p>}
                                                        />
                                                    </div>)
                                            }
                                        </Card>
                                    ) : (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }}>
                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<Avatar icon={<TeamOutlined />} />}
                                                            title={item.conversationName}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<Avatar icon={<TeamOutlined />} />}
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

const HeaderMessageChat = ({ conversationSelected, lastTimeOnline }) => (
    <Card
        className={cx('card-header')}
        bodyStyle={bodyCardHeader}>

        {
            conversationSelected.users.length === 1 ? (
                <Meta
                    avatar={<Badge status="success" dot={conversationSelected.users[0].isOnline}><Avatar src={conversationSelected.users[0].avatar} /></Badge>}
                    title={conversationSelected.users[0].fullname}
                    // description={conversationSelected.users[0].isOnline ? <p>Đang hoạt động</p> : <p>Hoạt động {moment(conversationSelected.users[0].lastTimeOnline).fromNow()}</p>}
                    description={conversationSelected.users[0].isOnline ? <p>Đang hoạt động</p> : <p>Hoạt động {lastTimeOnline || moment(conversationSelected.users[0].lastTimeOnline).fromNow()}</p>}
                />
            ) : (
                <Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={conversationSelected.conversationName}
                />
            )
        }
    </Card>
)

const BodyMessageChat = ({ messages, conversationSelected, messagesEndRef }) => {
    var userId = +getUserId();
    if (userId === undefined || userId === null) return;

    return (
        <div id={cx('scrollChatMessage')}>
            <InfiniteScroll
                dataLength={messages.length}
                scrollableTarget="scrollChatMessage"
            >
                <List
                    dataSource={messages}
                    renderItem={(item) => (
                        <>
                            {
                                item.userId !== userId ?
                                    (<div style={{ marginBottom: 25 }}>
                                        <Card className={cx('card-message')} bodyStyle={styleBodyCardMessage}>
                                            {
                                                item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? (
                                                    <Meta
                                                        avatar={<Avatar size={30} src={item.avatar} />}
                                                        title={item.content} />
                                                ) : (
                                                    <Meta
                                                        avatar={<Avatar size={30} src={item.avatar} />}
                                                        title={<Image
                                                            width={200}
                                                            src={item.content}
                                                        />} />
                                                )

                                            }

                                        </Card>
                                        <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                    </div>)
                                    :
                                    (<div style={{ marginBottom: 25, position: 'relative' }}>
                                        <div className={cx('style-message-sender-1')}>
                                            <Card className={cx('card-message-sender')} bodyStyle={styleBodyCardMessage}>
                                                {
                                                    item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? (
                                                        <Meta
                                                            title={item.content} />
                                                    ) : (
                                                        <Meta
                                                            title={<Image
                                                                width={200}
                                                                src={item.content}
                                                            />} />
                                                    )

                                                }


                                            </Card>
                                            <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                        </div>

                                    </div>)
                            }
                        </>

                    )}
                />
            </InfiniteScroll>
            <div ref={messagesEndRef} />
        </div>
    )
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
        <div className={cx('input-message-chat')}>
            <Form
                name="control-hooks"
                form={form}
                onFinish={onFinish}
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
        </div>)
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
        lastTimeOnline
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
                            messagesEndRef={messagesEndRef} />
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

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userChats, setUserChats] = useState([]);
    const [conversationSelected, setConversationSelected] = useState(null);
    const [lastTimeOnline, setLastTimeOnline] = useState('');
    const [form] = Form.useForm();
    const [isUploadFile, setIsUploadFile] = useState(false)


    const handleOpenUploadFile = () => {
        setIsUploadFile(!isUploadFile)
    }

    const messagesEndRef = useRef(null);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    const uploadButton = (
        <Button type="primary" shape="circle" icon={<FileImageOutlined />} size={30} />
    );

    // const scrollToBottom = () => {
    //     messagesEndRef.current.scrollIntoView({behavior: "smooth" });
    // };

    // Handles

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
        const newConversation = userChats.map((item) => {
            if (item.conversationId === conversation.conversationId) {

                return { ...item, isRead: USER_CONVERSATION_TYPE_IS_READ }
            }
            return item;
        })
        setUserChats(newConversation)

        // get last time online
        getOnlineStatusUser(userId)
            .then((res) => {

            }).catch((error) => {
                console.log(error);
            })
        setConversationSelected(conversation)
    }

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }


    useEffect(() => {
        if (conversationSelected === null || conversationSelected === undefined) return;
        GetMessages(conversationSelected.conversationId)
            .then((response) => {
                setMessages([...response.data])
            })

    }, [conversationSelected])

    // useEffect(scrollToBottom, [messages]);

    const intervalTime = () => {

        if (conversationSelected === null || conversationSelected === undefined) return;
        const interval = setInterval(() => {
            if (conversationSelected.users.length === 1) {
                setLastTimeOnline(moment(conversationSelected.users[0].lastTimeOnline).fromNow());
            }
        }, 60000);
        return () => clearInterval(interval);
    }

    intervalTime();


    useEffect(() => {
        if (user === null || user === undefined) return;

        const loadUsersChatMessage = () => {
            GetUsersConversation(user.id)
                .then((response) => {
                    const conversations = response.data
                    setUserChats(conversations);
                    if (conversationIdPath) {
                        const conversationFilter = conversations.find(c => c.conversationId === conversationIdPath);
                        setConversationSelected(conversationFilter)
                    }
                })
                .catch((errors) => {
                    console.log(errors)
                });

        };

        loadUsersChatMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // message from signR
    const message = useContext(ChatContext);

    useEffect(() => {
        const userId = +getUserId()

        const setMessage = () => {
            if (message) {
                if ('messageId' in message) {
                    // data update message chat
                    if (conversationSelected.conversationId === message.conversationId) {
                        setMessages((prev) => [...prev, message])
                    }

                    // data update new user chat
                    const newUserChat = userChats.map((item) => {
                        if (item.conversationId === message.conversationId) {
                            if (message.userId !== userId) {
                                if (conversationSelected.conversationId === message.conversationId) {
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
                    setUserChats(newUserChat)
                } else {
                    const filterUserChat = userChats.find(x => x.conversationId === message.conversationId);
                    if (!filterUserChat) {
                        setUserChats((prev) => [...prev, message])
                    }
                }
            }
        }

        setMessage();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])


    // user online status
    const userOnlineStatusContext = useContext(UserOnlineStatusContext);

    useEffect(() => {
        const setOnlineStatus = () => {
            if (userOnlineStatusContext) {
                // parse to json
                const userOnlineStatusJson = JSON.parse(userOnlineStatusContext)

                if (userChats.length === 0) return;
                // update users status conversations
                const updateUserStatusConversations = async () => {
                    const findConversation = userChats.find(x => x.conversationId === userOnlineStatusJson.ConversationId);
                    const newUserInConversation = await Promise.all(findConversation.users.map(async (user) => {
                        if (user.userId === userOnlineStatusJson.UserId) {
                            try {
                                const res = await getOnlineStatusUser(user.userId);
                                if (res.status === 200) {
                                    const lastTimeOnline = res.data.lastTimeOnline
                                    const isOnline = userOnlineStatusJson.IsOnline;
                                    updateUserStatusConversationSelected(isOnline, lastTimeOnline)
                                    return { ...user, isOnline: isOnline, lastTimeOnline: lastTimeOnline }
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        return user;
                    }));

                    //set new users
                    findConversation.users = newUserInConversation

                    //
                    const newUserChat = userChats.map((x) => {
                        if (x.conversationId === findConversation.conversationId) {
                            return { ...findConversation };
                        }
                        return x;
                    })

                    setUserChats(newUserChat);
                };

                // update users status conversations selected
                const updateUserStatusConversationSelected = (IsOnline, lastTimeOnline) => {
                    if (conversationSelected !== null && conversationSelected !== undefined) {
                        const newConversationSelected = conversationSelected;
                        const newUserInConversation = newConversationSelected.users.map((user) => {
                            if (user.userId === userOnlineStatusJson.UserId) {
                                return { ...user, isOnline: IsOnline, lastTimeOnline: lastTimeOnline }
                            }
                            return user;
                        });

                        //set new users
                        newConversationSelected.users = newUserInConversation

                        setConversationSelected(newConversationSelected);
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
        lastTimeOnline: lastTimeOnline
    }

    return (
        <div className={cx('container')}>
            <LayoutUserChat
                userChats={userChats}
                handleClickUser={handleClickUser}
                conversationSelected={conversationSelected} />
            <LayoutMessageChat propsMessageChat={propsMessageChat} />
        </div>
    );
}

export default ChatBox;


