import React from 'react';
import { Avatar } from 'antd';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';

const cx = classNames.bind(styles);

const SmallUserAvatar = ({ srcAvatar, isActive }) => (
    <div className={cx('small-avatar')}>
        <Avatar size={40} src={srcAvatar} />
        {isActive ? <span className={cx('small-avatar-status')}></span> : <></>}
    </div>
)

export default SmallUserAvatar;