import React, { useState, useEffect } from 'react'
import { Layout, Input, Button, Avatar, Divider, List, Skeleton } from 'antd';
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import { getSenderConversations, getListMessage, sendMessage } from '~/api/chat';
import {
    SendOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';

import classNames from 'classnames/bind';
import styles from './Chatbox.module.scss'

const cx = classNames.bind(styles);

const ChatBox = () => {
    const auth = useAuthUser();
    const user = auth();
    const limit = 3
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [page, setPage] = useState(1)

    const loadMoreData = () => {

        if (loading) {
            return;
        }
        setLoading(true);
        getSenderConversations(user.id, page, limit)
            .then((response) => {

                setData([...data, ...response.data]);
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors)
                setLoading(false);
            });

    };


    useEffect(() => {
        if (user === null || user === undefined) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${user.id}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        loadMoreData();
        connection.on("ReceiveMessage", (response) => {
            setMessages((prev) => [...prev, response])
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };
    }, []);


    const handleSendMessage = () => {
        if (user === null || user === undefined) return;
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
        setSelectedUser({ userId: user.userId, conversationId: user.conversationId })
    }

    useEffect(() => {
        if (selectedUser === null) return;
        getListMessage(selectedUser.conversationId)
            .then((response) => {
                setMessages([...response.data])
            })
    }, [selectedUser])

    return (

        <div className={cx('container')} style={{}}>

            <Layout style={{ height: '70vh', width: '30%' }}>
                <div
                    id="scrollableDiv"
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
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item onClick={() => { handleClickUser(item) }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={<a href="https://ant.design">{item.username}</a>}
                                        description={item.email}
                                    />
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>

            </Layout>
            <Layout style={{ height: '70vh', width: '65%', padding: 10 }}>
                <div className="chat-input">
                    <div
                        id="scrollChatInput"
                        style={{
                            height: '60vh',
                            overflow: 'auto',
                            padding: '0 16px',

                        }}
                    >

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
                            scrollableTarget="scrollChatInput"
                        >
                            <List
                                dataSource={messages}
                                renderItem={(item) => (
                                    <List.Item key={item.conversationId} onClick={() => { handleClickUser(item.conversationId) }}>
                                        {item.content}
                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll>
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


