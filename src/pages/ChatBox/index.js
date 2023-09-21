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
import { getSenderConversations, getListMessage, sendMessage } from '~/api/chat';
import {
    SendOutlined,
    FileImageOutlined
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'
import moment from 'moment'

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
    handleChangeNewMessage,
    stateUploadFile,
    handleClickUpfile }) => {

    return (
        <div className={cx('input-message-chat')}>
            <Form
                name="control-hooks"
                form={form}
                onFinish={onFinish}
            >
                {
                    stateUploadFile ? (
                        <Row>
                            <Col span={24}>
                                <Form.Item name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
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
                        <Button style={{ marginLeft: 15 }} type="primary" shape="circle" icon={<FileImageOutlined />} size={30} onClick={handleClickUpfile} />
                    </Col>
                    <Col span={22}>
                        <Form.Item>
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={handleChangeNewMessage}
                                onPressEnter={onFinish}
                                suffix={
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        htmlType="submit"
                                    />
                                }
                            />
                        </Form.Item>
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
        handleChangeNewMessage,
        stateUploadFile,
        handleClickUpfile } = props.propsMessageChat

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
                handleChangeNewMessage={handleChangeNewMessage}
                stateUploadFile={stateUploadFile}
                handleClickUpfile={handleClickUpfile} />
        </Layout>
    )
}

const ChatBox = () => {
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
    const [userChats, setuserChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
    const [stateUploadFile, setStateUploadFile] = useState(false)
    const [form] = Form.useForm();
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

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    // Handles

    const onFinish = (values) => {
        if (user === null || user === undefined) return;
        // if (newMessage.length === 0) return;

        const request = {
            conversationId: selectedUser.conversationId,
            senderId: user.id,
            recipientId: selectedUser.userId,
            content: newMessage,
            dateCreate: new Date(),
            isImage: false
        }
        const messageState = {
            userId: user.id,
            conversationId: selectedUser.conversationId,
            content: newMessage,
            dateCreate: new Date()
        }
        setMessages([...messages, messageState])
        sendMessage(request)
            .then(response => {
                // Tin nhắn đã được gửi thành công đến API và xử lý ở đó.
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

    const handleClickUpfile = () => {
        setStateUploadFile(!stateUploadFile)
    }

    // const onFinish = (values) => {
    //     var bodyFormData = new FormData();
    //     bodyFormData.append('isPublic', values.visible);
    //     bodyFormData.append('userId', 1);
    //     bodyFormData.append('fileUpload', values.upload[0].originFileObj);
    //     uploadFile('api/Files/Upload', bodyFormData)
    //         .then((res) => { openNotificationWithIcon('success') })
    //         .catch((err) => { openNotificationWithIcon('error') });
    // };

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
                    setuserChats(response.data);
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
        connection.on("ReceiveMessage", (response) => {
            setMessages((prev) => [...prev, response])
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const propsMessageChat = {
        selectedUser: selectedUser,
        messages: messages,
        messagesEndRef: messagesEndRef,
        form: form,
        onFinish: onFinish,
        uploadButton: uploadButton,
        newMessage: newMessage,
        handleChangeNewMessage: handleChangeNewMessage,
        normFile: normFile,
        stateUploadFile: stateUploadFile,
        handleClickUpfile: handleClickUpfile
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


