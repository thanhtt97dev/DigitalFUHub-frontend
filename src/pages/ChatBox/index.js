import React, { useState, useEffect, useRef } from 'react'
import { Layout, Input, Button, Menu } from 'antd';
import connectionHub from '~/api/signalr/connectionHub';
import { useAuthUser } from 'react-auth-kit';
import {
    UserOutlined,
    SendOutlined,
} from '@ant-design/icons';


const { Sider, Content } = Layout;


const ChatBox = () => {
    const auth = useAuthUser();
    const user = auth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const messageContainerRef = useRef(null);

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

            // if (messageContainerRef.current) {
            //     messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            // }
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

    const userList = ['User1', 'User2', 'User3', 'User4'];




    return (
        <>
            {/* <Layout>
                <Header>Chat App</Header>
                <Content>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    // avatar={<Avatar>{item.sender[0]}</Avatar>}
                                    title={item.sender}
                                    description={item.text}
                                />
                            </List.Item>
                        )}
                    />
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={e => newMessage(e.target.value)}
                        onPressEnter={handleSendMessage}
                        addonAfter={<Button type="primary" onClick={handleSendMessage}>Send</Button>}
                    />
                </Content>
            </Layout> */}



            <Layout style={{ minHeight: '100vh' }}>
                <Sider theme="dark" width={200}>
                    <Menu mode="vertical" theme="dark" defaultSelectedKeys={['1']}>
                        {
                            userList.map((userName, index) =>
                                <Menu.Item
                                    key={index}
                                    icon={<UserOutlined />}
                                    onClick={() => setSelectedUser(userName)}
                                >{userName}</Menu.Item>)
                        }
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ padding: '24px' }}>
                        <div className="chat-container">
                            <div className="message-container">
                                {selectedUser ? (
                                    <div className="chat-header">{selectedUser}</div>
                                ) : (
                                    <div className="chat-header">Chat</div>
                                )}
                                <div className="chat-messages" ref={messageContainerRef}>
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message ${message.sent ? 'sent' : 'received'
                                                }`}
                                        >
                                            <div className="message-avatar">
                                                {message.sender[0]}
                                            </div>
                                            <div className="message-content">{message.text}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input">
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
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default ChatBox;