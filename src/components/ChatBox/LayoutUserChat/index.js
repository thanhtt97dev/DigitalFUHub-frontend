import React from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import fptImage from '~/assets/images/fpt-logo.jpg';
import SmallUserAvatar from '../SmallUserAvatar';
import { Layout, List, Card, Typography } from 'antd';
import { USER_CONVERSATION_TYPE_UN_READ } from '~/constants';

const cx = classNames.bind(styles);

const LayoutUserChat = ({ userChats, handleClickUser, conversationSelected }) => {

    /// styles
    const bodyCardHeader = { padding: 15 }
    const styleTypography = { margin: 0 }
    const styleScrollUserChat = { height: '100%', overflow: 'auto', padding: '0 16px' }
    ///
    return (
        <Layout className={cx('layout-user-chat')}>
            <Card
                bordered
                bodyStyle={bodyCardHeader}>
                <Typography.Title
                    level={4}
                    style={styleTypography}
                >
                    Gần đây
                </Typography.Title>
            </Card>
            <div id="scrollUserChat" style={styleScrollUserChat}>
                <InfiniteScroll
                    dataLength={userChats.length}
                    scrollableTarget="scrollUserChat"
                >
                    <List
                        dataSource={userChats}
                        renderItem={(item) => (
                            <List.Item onClick={() => { handleClickUser(item) }}>
                                {
                                    item.isGroup === false ? (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>

                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={item.users[0].avatar} isActive={item.isOnline} />}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={item.users[0].avatar} isActive={item.isOnline} />}
                                                            title={item.users[0].fullname}
                                                            description={<p className={cx('text-ellipsis')}>{item.latestMessage}</p>}
                                                        />
                                                    </div>)
                                            }
                                        </Card>
                                    ) : (
                                        <Card hoverable className={item.conversationId === conversationSelected?.conversationId ? cx('backgroud-selected') : ''} style={{ width: '100%' }} bodyStyle={{ padding: 15 }}>
                                            {
                                                item.isRead === USER_CONVERSATION_TYPE_UN_READ ?
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={fptImage} isActive={item.isOnline} />}
                                                            title={item.conversationName}
                                                            description={<p className={cx('text-ellipsis', 'text-un-read')} >{item.latestMessage}</p>}
                                                        />
                                                        <div className={cx('circle')}></div>
                                                    </div>)
                                                    :
                                                    (<div className={cx('space-div-flex')}>
                                                        <List.Item.Meta
                                                            avatar={<SmallUserAvatar srcAvatar={fptImage} isActive={item.isOnline} />}
                                                            title={item.conversationName}
                                                            description={<p className={cx('text-ellipsis')}>{item.latestMessage}</p>}
                                                        />
                                                    </div>)
                                            }
                                        </Card>
                                    )
                                }

                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>

        </Layout>
    )
}

export default LayoutUserChat;