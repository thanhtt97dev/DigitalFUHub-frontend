import React from 'react';
import { Avatar } from 'antd';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';

const cx = classNames.bind(styles);

const BigUserAvatar = ({ srcAvatar, isActive }) => (
    <div className={cx('big-avatar')}>
        <Avatar size={50} src={srcAvatar} />
        {isActive ? <span className={cx('big-avatar-status')}></span> : <></>}
    </div>
)

export default BigUserAvatar;