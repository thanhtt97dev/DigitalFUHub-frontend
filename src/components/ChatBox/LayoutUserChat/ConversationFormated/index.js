import React from 'react';
import classNames from 'classnames/bind';
import SmallUserAvatar from '../../SmallUserAvatar';
import fptImage from '~/assets/images/fpt-logo.jpg';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import { List, Card, Space } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ } from '~/constants';

///
const cx = classNames.bind(styles);
require('moment/locale/vi');
const moment = require('moment');
///

const ConversationFormated = ({ conversation, handleClickUser, conversationSelected, isYourLatestMessage, isLatestMessageTypeText, isLatestMessageTypeImage, getFullNameUser }) => {

    const AvatarFormated = ({ isGroup }) => (
        <SmallUserAvatar srcAvatar={isGroup ? fptImage : conversation.users[0].avatar} isActive={conversation.isOnline} />
    );

    const TitleFormated = ({ isGroup }) => (<>
        {
            isGroup ? conversation.conversationName : conversation.users[0].fullname
        }
    </>);

    const CircleFormated = ({ isRead }) => (<>{
        isRead === USER_CONVERSATION_TYPE_UN_READ ? <div className={cx('circle')}></div> : <></>
    }</>)

    const DescriptionFormated = ({ latestMessage, isRead, users, isGroup }) => {
        return (
            <Space align='center' size={5}>
                <p className={isRead === USER_CONVERSATION_TYPE_UN_READ ? cx('text-ellipsis', 'text-un-read') : cx('text-ellipsis')}>
                    {
                        isYourLatestMessage(latestMessage) ? (<>
                            {isLatestMessageTypeText(latestMessage) && `Bạn: ${latestMessage.content}`}
                            {isLatestMessageTypeImage(latestMessage) && 'Bạn đã gửi một hình ảnh'}
                        </>) : (<>{
                            !isGroup ? (<>
                                {isLatestMessageTypeText(latestMessage) && latestMessage.content}
                                {isLatestMessageTypeImage(latestMessage) && `${getFullNameUser(users, latestMessage.userId)} đã gửi một hình ảnh`}
                            </>) : (<>
                                {isLatestMessageTypeText(latestMessage) && `${getFullNameUser(users, latestMessage.userId)}: ${latestMessage.content}`}
                                {isLatestMessageTypeImage(latestMessage) && `${getFullNameUser(users, latestMessage.userId)} đã gửi một hình ảnh`}
                            </>)
                        }
                        </>)

                    }
                </p>
                <p>·</p>
                <p>{moment(conversation.latestMessage?.dateCreate).fromNow()}</p>
            </Space>
        )
    }

    return (
        <List.Item onClick={() => { handleClickUser(conversation) }}>
            <Card hoverable className={conversation.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>
                <div className={cx('space-div-flex')}>
                    <List.Item.Meta avatar={<AvatarFormated isGroup={conversation.isGroup} />}
                        title={<TitleFormated isGroup={conversation.isGroup} />}
                        description={<DescriptionFormated latestMessage={conversation.latestMessage}
                            isRead={conversation.isRead}
                            users={conversation.users}
                            isGroup={conversation.isGroup} />}
                    />
                    <CircleFormated isRead={conversation.isRead} />
                </div>
            </Card>
        </List.Item>
    )
};

export default ConversationFormated;