import React, { useState } from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { formatNumber } from '~/utils';
import { useAuthUser } from 'react-auth-kit';
import { getConversation } from '~/api/chat';
import { useNavigate } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { Col, Row, Button, Space, Avatar } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faUserPlus } from "@fortawesome/free-solid-svg-icons";


///
require('moment/locale/vi');
const cx = classNames.bind(styles);
const moment = require('moment');
///

/// styles
const styleContainerComponent = { backgroundColor: 'white', padding: 20, borderRadius: 2, boxShadow: '#d3d3d3 0px 1px 2px 0px' };
const styleColUserInfo = { borderRight: '1px solid rgb(232, 232, 232)' };
///

const GeneralDescription = ({ shop, userId, isShopBan }) => { // userId : shop id from param

    /// states
    const [isLoadingButtonSendMessage, setIsLoadingButtonSendMessage] = useState(false);
    ///
    /// router
    const navigate = useNavigate();
    ///


    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// handles
    const calculatorRatingStarProduct = () => {
        if (!shop) return 0;
        return shop.totalRatingStar / shop.numberFeedback;
    }

    const handleSendMessage = () => {
        if (user === undefined || user === null) return navigate('/login');

        setIsLoadingButtonSendMessage(true);

        const data = { shopId: userId, userId: user.id }

        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setIsLoadingButtonSendMessage(false);
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => { })
    }
    ///

    return (
        <div style={styleContainerComponent}>
            <Row className={cx('container-page-detail')}>

                <Col span={8} style={styleColUserInfo}>
                    <Space align="center" size={15}>
                        <div className={cx('big-avatar')}>
                            <Avatar size={90} src={shop.avatar} />
                            {shop.user?.isOnline ? <span className={cx('big-avatar-status')}></span> : <></>}
                        </div>
                        <Space direction="vertical" size={10}>
                            <Space direction="vertical" size={0}>
                                <p className={cx('shop-name')}>{shop.shopName}</p>
                                <p className={cx('active-time')}>{shop.user?.isOnline ? 'Đang hoạt động' : 'Hoạt động ' + moment(shop.user?.lastTimeOnline).fromNow()}</p>
                            </Space>
                            <Button disabled={user?.id === +userId || isShopBan() ? true : false} className={cx('margin-element')} icon={<MessageOutlined />} size={'small'} onClick={handleSendMessage} loading={isLoadingButtonSendMessage}>
                                Chat ngay
                            </Button>
                        </Space>
                    </Space>
                </Col>
                <Col span={16} className={cx('flex-item-center')}>
                    <Space size={100} align="center">
                        <Space align="center">
                            <p><FontAwesomeIcon className={cx('icon-description')} icon={faShoppingBag} /></p>
                            <p className={cx('text-description')}>Sản phẩm:</p>
                            <p className={cx('text-color-description')}>{shop.productNumber}</p>
                        </Space>
                        <Space align="center">
                            <p><FontAwesomeIcon className={cx('icon-description')} icon={faStar} /></p>
                            <p className={cx('text-description')}>Đánh giá:</p>
                            <p className={cx('text-color-description')}>{calculatorRatingStarProduct() ? calculatorRatingStarProduct().toFixed(1) : 0} ({shop.numberFeedback ? formatNumber(shop.numberFeedback) : 0} Đánh giá)</p>
                        </Space>
                        <Space align="center">
                            <p><FontAwesomeIcon className={cx('icon-description')} icon={faUserPlus} /></p>
                            <p className={cx('text-description')}>Tham gia:</p>
                            <p className={cx('text-color-description')}>{moment(shop.dateCreate).fromNow()}</p>
                        </Space>
                    </Space>
                </Col>
            </Row>

        </div>
    )
}

export default GeneralDescription;