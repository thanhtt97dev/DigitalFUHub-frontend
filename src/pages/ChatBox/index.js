import React, { useState, useEffect, useRef } from 'react'
import { Layout, Input, Button, Avatar, Divider, List, Skeleton, Card, Typography } from 'antd';
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import { getSenderConversations, getListMessage, sendMessage } from '~/api/chat';
import {
    SendOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'
import moment from 'moment'

const cx = classNames.bind(styles);
const { Meta } = Card;
const { Text } = Typography;

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
    const limit = 3
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
    const messagesEndRef = useRef(null);

    const [page, setPage] = useState(1)

    const loadMoreData = () => {

        if (loading) {
            return;
        }
        setLoading(true);
        getSenderConversations(user.id, page, limit)
            .then((response) => {
                setData((prev) => [...prev, ...response.data]);
                setSelectedUser(response.data[0])
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors)
                setLoading(false);
            });

    };

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);


    useEffect(() => {
        if (user === null || user === undefined) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${user.id}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        loadMoreData();
        connection.on("ReceiveMessage", (response) => {
            setMessages((prev) => [...prev, response])
            scrollToBottom();
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };
    }, []);


    // styles
    const bodyCardMessageSender = {
        padding: 16
    }

    const bodyCardHeader = {
        padding: 20,
    }



    const handleSendMessage = () => {
        if (user === null || user === undefined) return;
        if (newMessage.length === 0) return;
        const request = {
            conversationId: selectedUser.conversationId,
            senderId: user.id,
            recipientId: selectedUser.userId,
            content: newMessage,
            dateCreate: new Date()
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

    useEffect(() => {
        if (selectedUser.userId === 0) return;
        getListMessage(selectedUser.conversationId)
            .then((response) => {
                setMessages([...response.data])
            })

    }, [selectedUser])

    return (

        <div className={cx('container')}>

            <Layout className={cx('layout-user-chat')}>
                <div
                    id="scrollUserChat"
                    style={{
                        height: '100%',
                        overflow: 'auto',
                        padding: '0 16px',

                    }}
                >

                    <InfiniteScroll
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={data.length < 50}
                        // loader={
                        //     <Skeleton
                        //         avatar
                        //         paragraph={{
                        //             rows: 1,
                        //         }}
                        //         active
                        //     />
                        // }
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollUserChat"
                    >
                        <List
                            dataSource={data}
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
            <Layout className={cx('layout-chat-message')}>
                <Card
                    className={cx('card-header')}
                    bodyStyle={bodyCardHeader}>
                    <Meta
                        avatar={<Avatar size={35} src={selectedUser.avatar} />}
                        title={selectedUser.fullname}
                    />
                </Card>
                <div className="chat-input">
                    <div id={cx('scrollChatMessage')}>
                        <InfiniteScroll
                            dataLength={messages.length}
                            // next={loadMoreData}
                            hasMore={data.length < 50}
                            // loader={
                            //     <Skeleton
                            //         avatar
                            //         paragraph={{
                            //             rows: 1,
                            //         }}
                            //         active
                            //     />
                            // }
                            // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                            scrollableTarget="scrollChatMessage"
                        >
                            <List
                                dataSource={messages}
                                renderItem={(item) => (

                                    <div style={{ marginBottom: 25 }}>
                                        {item.userId !== user.id ? (
                                            <>
                                                <Card className={cx('card-message')} bodyStyle={bodyCardMessageSender}>
                                                    <Meta
                                                        avatar={<Avatar size={30} src={selectedUser.avatar} />}
                                                        title={item.content} />
                                                </Card>
                                                <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                            </>
                                        ) : (<>
                                            <Card className={cx('card-message-sender')} bodyStyle={bodyCardMessageSender}>
                                                <Meta
                                                    title={item.content} />
                                            </Card>
                                            <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                        </>)}

                                    </div>

                                )}
                            />
                        </InfiniteScroll>
                        <div ref={messagesEndRef} />
                    </div>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onPressEnter={handleSendMessage}
                        suffix={
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleSendMessage}
                            />
                        }
                    />
                </div>
            </Layout>
        </div>


    );
}

export default ChatBox;


