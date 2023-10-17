import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import {
    Layout,
    Input,
    Button,
    Avatar,
    List,
    Card,
    Typography,
    Col,
    Row,
    Upload,
    Form,
    Image,
} from 'antd';
import Spinning from "~/components/Spinning";
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import { GetUsersConversation, GetMessages, sendMessage } from '~/api/chat';
import {
    SendOutlined,
    FileImageOutlined,
    TeamOutlined
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'
import moment from 'moment'
import { useLocation } from 'react-router-dom';
import { getVietnamCurrentTime } from '~/utils';
import { MESSAGE_TYPE_CONVERSATION_TEXT, MESSAGE_TYPE_CONVERSATION_IMAGE } from '~/constants';

import { SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE } from '~/constants';

const cx = classNames.bind(styles);
const { Meta } = Card;
const { Text } = Typography;

const bodyCardHeader = {
    padding: 20,
}

const styleBodyCardMessage = {
    padding: 16
}

const MyContext = createContext()

const LayoutUserChat = ({ userChats, handleClickUser, conversationSelected }) => (

    <Layout className={cx('layout-user-chat')}>
        <Card
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
                                    <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.users[0].avatar} />}
                                            title={item.users[0].fullname}
                                        />
                                    </Card>
                                ) : (
                                    <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }}>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<TeamOutlined />} />}
                                            title={item.conversationName}
                                        />
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

const HeaderMessageChat = ({ conversationSelected }) => (
    <Card
        className={cx('card-header')}
        bodyStyle={bodyCardHeader}>

        {
            conversationSelected.users.length === 1 ? (
                <Meta
                    avatar={<Avatar src={conversationSelected.users[0].avatar} />}
                    title={conversationSelected.users[0].fullname}
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
    const user = useContext(MyContext);
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
                                item.userId !== user.id ?
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
        isMessageInfoSuccess
    } = props.propsMessageChat

    return (

        <Spinning wrapperClassName={cx('custom-wrapper')} spinning={isMessageInfoSuccess}>
            <Layout className={cx('layout-chat-message')}>
                {
                    conversationSelected ? (<>

                        <HeaderMessageChat conversationSelected={conversationSelected} />
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
        </Spinning>

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
    const [isLoadData, setIsLoadData] = useState(false);
    const [form] = Form.useForm();
    const [isUploadFile, setIsUploadFile] = useState(false);
    const [responseSignR, setResponseSignR] = useState();
    const [isMessageInfoSuccess, setIsMessageInfoSuccess] = useState(false)


    const handleOpenUploadFile = () => {
        setIsUploadFile(!isUploadFile)
    }

    const loadData = () => {
        setIsLoadData(!isLoadData)
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
    //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
                    setIsUploadFile(false)
                    setNewMessage('');
                }
            })
            .catch(error => {
                console.error(error);
            });

    };


    const handleClickUser = (conversation) => {
        if (!isMessageInfoSuccess) {
            setIsMessageInfoSuccess(true);
            setConversationSelected(conversation)

            GetMessages(conversation.conversationId)
                .then((response) => {
                    setMessages([...response.data])
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    setTimeout(() => {
                        setIsMessageInfoSuccess(false)
                    }, 500)
                })
        }
    }

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }


    useEffect(() => {
        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${user.id}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        connection.on(SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE, (response) => {
            if (response.conversationId === conversationSelected.conversationId) {
                setMessages((prev) => [...prev, response])
            }
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected])


    // useEffect(() => {
    //     if (!responseSignR) return;
    //     if (responseSignR.conversationId === conversationSelected.conversationId) {
    //         setMessages((prev) => [...prev, responseSignR])
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [responseSignR])





    // useEffect(scrollToBottom, [messages]);


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
    }, [isLoadData]);

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
        isMessageInfoSuccess: isMessageInfoSuccess
    }

    return (
        <MyContext.Provider value={user}>
            <div className={cx('container')}>
                <LayoutUserChat
                    userChats={userChats}
                    handleClickUser={handleClickUser}
                    conversationSelected={conversationSelected} />
                <LayoutMessageChat propsMessageChat={propsMessageChat} />
            </div>
        </MyContext.Provider>
    );
}

export default ChatBox;


