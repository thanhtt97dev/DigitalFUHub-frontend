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
    Form
} from 'antd';
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import { getSenderConversations, getListMessage, sendMessage, existUserConversation } from '~/api/chat';
import {
    SendOutlined,
    FileImageOutlined
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'
import moment from 'moment'
import { useLocation } from 'react-router-dom';
import { getVietnamCurrentTime } from '~/utils'

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

const LayoutUserChat = ({ userChats, handleClickUser }) => (
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
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={item.username}
                                description={item.email}
                            />
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>

    </Layout>
)

const HeaderMessageChat = ({ selectedUser }) => (
    <Card
        className={cx('card-header')}
        bodyStyle={bodyCardHeader}>
        <Meta
            avatar={<Avatar size={35} src={selectedUser.avatar ?? ""} />}
            title={selectedUser.fullname}
        />
    </Card>
)

const BodyMessageChat = ({ messages, selectedUser, messagesEndRef }) => {
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
                                            <Meta
                                                avatar={<Avatar size={30} src={selectedUser.avatar} />}
                                                title={item.content} />
                                        </Card>
                                        <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                    </div>)
                                    :
                                    (<div style={{ marginBottom: 25, position: 'relative' }}>
                                        <div className={cx('style-message-sender-1')}>
                                            <Card className={cx('card-message-sender')} bodyStyle={styleBodyCardMessage}>
                                                <Meta
                                                    title={item.content} />
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
    handleChangeNewMessage }) => {

    const [isUploadFile, setIsUploadFile] = useState(false)

    const handleOpenUploadFile = () => {
        setIsUploadFile(!isUploadFile)
    }

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
        selectedUser,
        messages,
        styleBodyCardMessage,
        messagesEndRef,
        form,
        onFinish,
        normFile,
        uploadButton,
        newMessage,
        handleChangeNewMessage
    } = props.propsMessageChat

    return (
        <Layout className={cx('layout-chat-message')}>
            <HeaderMessageChat selectedUser={selectedUser} />
            <BodyMessageChat messages={messages}
                styleBodyCardMessage={styleBodyCardMessage}
                selectedUser={selectedUser}
                messagesEndRef={messagesEndRef} />
            <InputMessageChat form={form}
                onFinish={onFinish}
                normFile={normFile}
                uploadButton={uploadButton}
                newMessage={newMessage}
                handleChangeNewMessage={handleChangeNewMessage} />
        </Layout>
    )
}

const ChatBox = () => {
    const location = useLocation();
    let data = location.state?.data || null;
    const auth = useAuthUser();
    const user = auth();
    const initialSelectedUser = {
        userId: 0,
        username: '',
        email: '',
        fullname: '',
        avatar: '',
        conversationId: 0
    }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userChats, setUserChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
    const [loadData, setLoadData] = useState(false);
    const [form] = Form.useForm();
    const messagesEndRef = useRef(null);


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        const addNewConversation = () => {
            if (data) {
                const { userId, shopId } = data
                // eslint-disable-next-line react-hooks/exhaustive-deps
                data = null;
                existUserConversation(userId, shopId)
                    .then((res) => {
                        if (res.data === false) {
                            var bodyFormData = new FormData();
                            bodyFormData.append('conversationId', 0);
                            bodyFormData.append('senderId', userId);
                            bodyFormData.append('recipientId', shopId);
                            bodyFormData.append('content', '');
                            bodyFormData.append('messageType', '0');
                            bodyFormData.append('dateCreate', getVietnamCurrentTime());
                            sendMessage(bodyFormData)
                                .then((res) => {
                                    isLoadData()
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        }
                    })

            }
        }

        addNewConversation();
    }, [])

    const uploadButton = (
        <Button type="primary" shape="circle" icon={<FileImageOutlined />} size={30} />
    );

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    // Handles

    const onFinish = (values) => {
        console.log('onFinish')
        if (user === null || user === undefined) return;
        const { fileUpload } = values
        if ((newMessage === undefined || newMessage.length === 0) && fileUpload === undefined) return;

        var bodyFormData = new FormData();
        bodyFormData.append('conversationId', selectedUser.conversationId);
        bodyFormData.append('senderId', user.id);
        bodyFormData.append('recipientId', selectedUser.userId);
        bodyFormData.append('content', newMessage);
        bodyFormData.append('messageType', '0');
        for (var i = 0; i < fileUpload?.length || 0; i++) {
            bodyFormData.append('fileUpload', fileUpload[i].originFileObj);
        }
        bodyFormData.append('dateCreate', getVietnamCurrentTime());

        const messageState = {
            userId: user.id,
            conversationId: selectedUser.conversationId,
            content: newMessage,
            dateCreate: new Date()
        }
        setMessages([...messages, messageState])
        sendMessage(bodyFormData)
            .then(response => {
                setNewMessage('');
            })
            .catch(error => {
                console.error(error);
            });

    };


    const handleClickUser = (user) => {
        setSelectedUser(user)
    }

    const handleChangeNewMessage = (e) => {
        const { value } = e.target
        setNewMessage(value)
    }

    const isLoadData = () => {
        setLoadData(!loadData);
    }



    useEffect(() => {
        if (selectedUser.userId === 0) return;
        getListMessage(selectedUser.conversationId)
            .then((response) => {
                setMessages([...response.data])
            })

    }, [selectedUser])

    useEffect(scrollToBottom, [messages]);


    useEffect(() => {
        if (user === null || user === undefined) return;

        const loadUsersChatMessage = () => {
            getSenderConversations(user.id)
                .then((response) => {
                    const users = response.data
                    setUserChats(users);
                    setSelectedUser(response.data[0] ?? initialSelectedUser)
                })
                .catch((errors) => {
                    console.log(errors)
                });

        };

        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${user.id}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        loadUsersChatMessage();
        connection.on(SIGNAL_R_CHAT_HUB_RECEIVE_MESSAGE, (response) => {
            setMessages((prev) => [...prev, response])
            isLoadData()
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadData]);

    const propsMessageChat = {
        selectedUser: selectedUser,
        messages: messages,
        messagesEndRef: messagesEndRef,
        form: form,
        onFinish: onFinish,
        uploadButton: uploadButton,
        newMessage: newMessage,
        handleChangeNewMessage: handleChangeNewMessage,
        normFile: normFile
    }

    return (
        <MyContext.Provider value={user}>
            <div className={cx('container')}>
                <LayoutUserChat userChats={userChats} handleClickUser={handleClickUser} />
                <LayoutMessageChat propsMessageChat={propsMessageChat} />
            </div>
        </MyContext.Provider>
    );
}

export default ChatBox;


