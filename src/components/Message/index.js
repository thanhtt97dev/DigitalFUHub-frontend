import React from 'react';
import { Link } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import { Badge } from 'antd';

const cx = classNames.bind(styles);
const Message = () => {
    return (
        <Link to={'/chatBox'}>
            <Badge count={5} size="small">
                <MessageOutlined className={cx("icon")} />
            </Badge>
        </Link>
    )
}

export default Message;