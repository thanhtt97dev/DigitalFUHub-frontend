import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { Badge } from 'antd';
import { getConversationsUnRead } from "~/api/chat"
import { useAuthUser } from 'react-auth-kit';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { ChatContext } from "~/context/SignalR/ChatContext";

const cx = classNames.bind(styles);


const Message = () => {

    const location = useLocation();

    var auth = useAuthUser();
    var user = auth();

    // message from signR
    const message = useContext(ChatContext);

    /// states
    const [conversationIdUnReads, setConversationIdUnReads] = useState([]);
    const [newMessage, setNewMessage] = useState(null)
    const [hideUI, setHideUI] = useState(false)

    useEffect(() => {
        console.log(location)
        if (location.pathname === "/chatBox") {
            setHideUI(true)
        } else {
            setHideUI(false)
        }
    }, [location])

    /// useEffects
    useEffect(() => {
        getConversationsUnRead(user.id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setConversationIdUnReads(res.data.result)
                }
            })
            .catch(() => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (message === null || message === undefined) return;
        if (message.userId === user.id) return;
        setNewMessage(message)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    useEffect(() => {
        if (location.pathname !== "/chatBox") {
            handleReciveNewMessage()
        }
    })

    const handleReciveNewMessage = () => {
        if (newMessage === "" || newMessage === null || newMessage === undefined) return;
        if (!conversationIdUnReads.includes(newMessage.conversationId)) {
            setConversationIdUnReads((prev) => [...prev, newMessage.conversationId])
            setNewMessage(null)
        }
    }

    const handleClickChatIcon = () => {
        setConversationIdUnReads([])
    }

    return (
        <>
            {hideUI ? "" :
                <Link to={'/chatBox'} onClick={handleClickChatIcon}>
                    <Badge count={conversationIdUnReads.length} size="small">
                        <MessageOutlined className={cx("icon")} />
                    </Badge>
                </Link>
            }
        </>
    )
}

export default Message;
