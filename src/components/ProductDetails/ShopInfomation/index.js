import React, { useState } from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { getConversation } from '~/api/chat';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { formatNumber } from '~/utils';
import { MessageOutlined, ShopOutlined } from '@ant-design/icons';
import { Col, Row, Button, Skeleton, Avatar, Card, Space } from 'antd';
import { RESPONSE_CODE_SUCCESS } from '~/constants';

///
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);
///

/// styles
const styleFirstCard = { borderRadius: '6px 0 0 6px' };
const styleColUserInfo = { borderRight: '1px solid rgb(232, 232, 232)' };
///

const ShopInfomations = ({ product }) => {

    /// states
    const [isLoadingButtonSendMessage, setIsLoadingButtonSendMessage] = useState(false);
    ///

    /// navigates
    const navigate = useNavigate();
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// handles
    const handleSendMessage = () => {
        if (user === undefined || user === null) return navigate('/login');

        setIsLoadingButtonSendMessage(true);

        const data = { shopId: product.shop.shopId, userId: user.id }

        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setIsLoadingButtonSendMessage(false);
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => { })
    }

    const handleViewShop = (shopId) => {
        return navigate(`/shop/${shopId}`);
    }
    ///



    return (<>
        {
            product ?
                <Card style={styleFirstCard} className={cx('margin-bottom')}>
                    <Row>
                        <Col span={8} style={styleColUserInfo}>
                            <Space align="center" size={15}>
                                <div className={cx('big-avatar')}>
                                    <Avatar size={90} src={product.shop.avatar} />
                                    {product.shop.isOnline ? <span className={cx('big-avatar-status')}></span> : <></>}
                                </div>
                                <Space direction="vertical" size={10}>
                                    <Space direction="vertical" size={0}>
                                        <p className={cx('shop-name')}>{product.shop.shopName}</p>
                                        <p className={cx('active-time')}>{product.shop.isOnline ? 'Đang hoạt động' : 'Hoạt động ' + moment(product.shop.lastTimeOnline).fromNow()}</p>
                                    </Space>
                                    <Space align="center">
                                        <Button icon={<ShopOutlined />} type="primary" danger ghost onClick={() => handleViewShop(product.shop.shopId)}>Xem Shop</Button>
                                        <Button loading={isLoadingButtonSendMessage} disabled={user?.id !== product.shop.shopId ? false : true} type="primary" className={cx('margin-element')} icon={<MessageOutlined />} onClick={handleSendMessage} style={{ marginLeft: 10 }}>
                                            Chat ngay
                                        </Button>
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                        <Col span={16} className={cx('flex-item-center')}>
                            <Space size={100} align="center">
                                <Space align="center">
                                    <p className={cx('text-description')}>Sản phẩm:</p>
                                    <p className={cx('text-color-description')}>{product.shop.productNumber}</p>
                                </Space>
                                <Space align="center">
                                    <p className={cx('text-description')}>Đánh giá:</p>
                                    <p className={cx('text-color-description')}>{formatNumber(product.shop.feedbackNumber)}</p>
                                </Space>
                                <Space align="center">
                                    <p className={cx('text-description')}>Tham gia:</p>
                                    <p className={cx('text-color-description')}>{moment(product.shop.dateCreate).fromNow()}</p>
                                </Space>
                            </Space>
                        </Col>

                    </Row>
                </Card>
                : <Skeleton active />
        }
    </>)

}

export default ShopInfomations;