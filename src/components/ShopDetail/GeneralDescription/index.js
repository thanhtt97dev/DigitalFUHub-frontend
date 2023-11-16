import React, { useEffect, useState } from "react";
import { getShopDetail } from "~/api/shop";
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import { useAuthUser } from 'react-auth-kit';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { addConversation } from '~/api/chat';
import { MessageOutlined, ShopOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { discountPrice, formatPrice, formatNumber, getVietnamCurrentTime } from '~/utils';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Tabs, Card, Typography, Space, Rate, Avatar } from 'antd';

///
require('moment/locale/vi');
const cx = classNames.bind(styles);
const moment = require('moment');
///

const GeneralDescription = ({ shop, userId }) => { // userId : shop id from param

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
        if (user === undefined || user === null) {
            return navigate('/login');
        } else {
            const dataAddConversation = {
                dateCreate: getVietnamCurrentTime(),
                UserId: user.id,
                RecipientIds: [userId]
            }
            addConversation(dataAddConversation)
                .then((res) => {
                    if (res.status === 200) {
                        // data state
                        const data = {
                            data: res.data
                        }
                        navigate('/chatBox', { state: data })
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    const onChange = (key) => {
        console.log(key);
    };
    ///

    return (
        <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 2 }}>
            <Row className={cx('container-page-detail')}>
                <Col span={8} style={{ borderRight: '1px solid rgb(232, 232, 232)' }}>
                    <Space align="center" size={15}>
                        <Avatar size={90} src={shop.avatar} />
                        <Space direction="vertical" size={10}>
                            <Space direction="vertical" size={0}>
                                <p className={cx('shop-name')}>{shop.shopName}</p>
                                <p className={cx('active-time')}>{shop.isOnline ? 'Đang hoạt động' : moment(shop.lastTimeOnline).fromNow()}</p>
                            </Space>
                            <Button disabled={user?.id === +userId ? true : false} className={cx('margin-element')} icon={<MessageOutlined />} size={'small'} onClick={handleSendMessage}>
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