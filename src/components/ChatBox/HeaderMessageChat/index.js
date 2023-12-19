import React, { useEffect, useState } from 'react';
import BigUserAvatar from '../BigUserAvatar';
import classNames from 'classnames/bind';
import fptImage from '~/assets/images/fpt-logo.jpg';
import { Card, Space } from 'antd';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import { ADMIN_ROLE_NUMBER } from '~/constants';
import { FlatUiRetina } from '~/components/Icons/FlatUiRetina';

///
const { Meta } = Card;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);
///

/// styles
const bodyCardHeader = { padding: 15 }
///

const HeaderMessageChat = ({ conversationSelected }) => {

    /// states
    const [lastTimeOnline, setLastTimeOnline] = useState('');
    ///

    /// useEffect
    useEffect(() => {
        if (conversationSelected === null || conversationSelected === undefined) return;
        if (conversationSelected.isOnline === true) return;
        if (conversationSelected.isGroup === true) return;
        setLastTimeOnline(moment(conversationSelected.lastTimeOnline).fromNow());

        const interval = setInterval(() => {
            setLastTimeOnline(moment(conversationSelected.lastTimeOnline).fromNow());
        }, 60000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected])
    ///

    return (
        <Card
            bodyStyle={bodyCardHeader}>
            {
                conversationSelected.isGroup === false ? (
                    <Meta
                        avatar={<BigUserAvatar srcAvatar={conversationSelected.users[0].avatar} isActive={conversationSelected.isOnline} />}
                        title={<Space size={8}><p>{conversationSelected.users[0].fullname}</p>{conversationSelected.users[0].roleId === ADMIN_ROLE_NUMBER ? <div style={{ height: '100%' }} className={cx('fex-align-item-center')}><FlatUiRetina /></div> : <></>}</Space>}
                        description={conversationSelected.isOnline ? <p>Đang hoạt động</p> : <p>Hoạt động {lastTimeOnline}</p>}
                    />
                ) : (
                    <Meta
                        avatar={<BigUserAvatar srcAvatar={fptImage} isActive={conversationSelected.isOnline} />}
                        title={conversationSelected.conversationName}
                    />
                )
            }
        </Card>)

}

export default HeaderMessageChat;