import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { Badge } from 'antd';
import { NotificationMessageContext } from "~/context/NotificationMessageContext";

const cx = classNames.bind(styles);


const Message = () => {
    /// states
    const [numberConversationUnRead, setNumberConversationUnRead] = useState(0);
    ///

    const contextData = useContext(NotificationMessageContext);
    /// useEffects
    useEffect(() => {
        if (contextData) {
            setNumberConversationUnRead(contextData.numberConversationUnRead);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextData])
    ///


    return (
        <Link to={'/chatBox'}>
            <Badge count={numberConversationUnRead} size="small">
                <MessageOutlined className={cx("icon")} />
            </Badge>
        </Link>
    )
}

export default Message;
