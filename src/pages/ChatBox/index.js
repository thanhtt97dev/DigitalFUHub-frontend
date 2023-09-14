import React, { useState, useEffect, useRef } from 'react'
import { Layout, Input, Button, Menu, Avatar, Divider, List, Skeleton } from 'antd';
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import {
    UserOutlined,
    SendOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';


const { Sider, Content } = Layout;


const ChatBox = () => {
    const auth = useAuthUser();
    const user = auth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {

        if (user === null || user === undefined) return;
        // Create a new SignalR connection with the token
        const connection = connectionHub(`chatHub?userId=${user.id}`);
        console.log(connection);
        // Start the connection
        connection.start().catch((err) => console.error(err));


        connection.on("ReceiveMessage", (response) => {
            debugger
            console.log(`messageContent = ${response.messageContent}, senderId = ${response.senderId}`);
            setMessages([...messages, { sender: response.senderId, text: response.messageContent }])

        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };


    }, [messages, user]);



    const handleSendMessage = () => {
        // axios.post('/api/chat/SendMessage', {
        //     user: 'User',
        //     text: newMessage
        // })
        //     .then(response => {
        //         // Tin nhắn đã được gửi thành công đến API và xử lý ở đó.
        //         setNewMessage('');
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    };




    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);

        fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    return (

        <div style={{ border: '1px solid rgba(140, 140, 140, 0.35)', width: '100%', display: 'flex' }}>

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
                        loader={
                            <Skeleton
                                avatar
                                paragraph={{
                                    rows: 1,
                                }}
                                active
                            />
                        }
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item key={item.email}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.picture.large} />}
                                        title={<a href="https://ant.design">{item.name.last}</a>}
                                        description={item.email}
                                    />
                                    <div>Content</div>
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
            </Layout>
            <Layout style={{ height: '70vh', width: '65%', padding: 10 }}>
                <div className="chat-input">
                    <div
                        id="scrollableDiv"
                        style={{
                            height: '60vh',
                            overflow: 'auto',
                            padding: '0 16px',

                        }}
                    >

                        <InfiniteScroll
                            dataLength={data.length}
                            next={loadMoreData}
                            hasMore={data.length < 50}
                            loader={
                                <Skeleton
                                    avatar
                                    paragraph={{
                                        rows: 1,
                                    }}
                                    active
                                />
                            }
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                            scrollableTarget="scrollableDiv"
                        >
                            {messages}
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


