import React from 'react';
import fptImage from '~/assets/images/fpt-logo.jpg';
import BigUserAvatar from '../BigUserAvatar'
import { Card } from 'antd';

const { Meta } = Card;
require('moment/locale/vi');
const moment = require('moment');

/// styles
const bodyCardHeader = {
    padding: 15,
}
///
const HeaderMessageChat = ({ conversationSelected, lastTimeOnline }) => (
    <Card
        bodyStyle={bodyCardHeader}>
        {
            conversationSelected.isGroup === false ? (
                <Meta
                    avatar={<BigUserAvatar srcAvatar={conversationSelected.users[0].avatar} isActive={conversationSelected.isOnline} />}
                    title={conversationSelected.users[0].fullname}
                    description={conversationSelected.isOnline ? <p>Đang hoạt động</p> : <p>Hoạt động {lastTimeOnline ? lastTimeOnline : moment(conversationSelected.lastTimeOnline).fromNow()}</p>}
                />
            ) : (
                <Meta
                    avatar={<BigUserAvatar srcAvatar={fptImage} isActive={conversationSelected.isOnline} />}
                    title={conversationSelected.conversationName}
                />
            )
        }
    </Card>
)

export default HeaderMessageChat;