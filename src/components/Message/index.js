import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserId } from '~/utils';
import { MessageOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { Badge } from 'antd';
import { useAuthUser } from 'react-auth-kit';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { ChatContext } from "~/context/ChatContext";
import { getNumberConversationUnRead } from '~/api/chat';

const cx = classNames.bind(styles);
const Message = () => {
    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [numberConversationUnRead, setNumberConversationUnRead] = useState(0);
    ///

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) return;
        getNumberConversationUnRead(user.id)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setNumberConversationUnRead(result);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])


    // message from signR
    const message = useContext(ChatContext);

    useEffect(() => {

        const setMessage = () => {
            console.log('mess = ' + message)
        }

        setMessage();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])



    return (
        <Link to={'/chatBox'}>
            <Badge count={numberConversationUnRead} size="small">
                <MessageOutlined className={cx("icon")} />
            </Badge>
        </Link>

        // <Badge count={numberConversationUnRead} size="small">
        //     <MessageOutlined className={cx("icon")} />
        // </Badge>
    )
}

export default Message;