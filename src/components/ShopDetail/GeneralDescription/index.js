import React, { useEffect, useState } from "react";
import { getShopDetail } from "~/api/shop";
import { useParams } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { discountPrice, formatPrice, formatNumber } from '~/utils';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Radio, Card, Typography, Space, Rate, Avatar } from 'antd';
///
const { Title, Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
///

const GeneralDescription = ({ shop }) => {

    /// handles
    const calculatorRatingStarProduct = () => {
        if (!shop) return 0;
        return shop.totalRatingStar / shop.numberFeedback;
    }
    ///

    return (
        <Row style={{ backgroundColor: 'white' }}>
            <Col span={10}>
                <Space align="center">
                    <Avatar size={100} src={shop.avatar} />
                    <Space direction="vertical">
                        <Title style={{ fontSize: '1.25rem' }}>{shop.shopName}</Title>
                        <Title style={{ fontSize: '1.25rem' }}>{shop.isOnline ? 'Đang hoạt động' : moment(shop.lastTimeOnline).fromNow()}</Title>
                    </Space>
                </Space>
            </Col>
            <Col span={14}>
                <Space size={100} align="center">
                    <Space align="center">
                        <p><FontAwesomeIcon icon={faShoppingBag} /></p>
                        <p>Sản phẩm:</p>
                        <p>{shop.productNumber}</p>
                    </Space>
                    <Space align="center">
                        <p><FontAwesomeIcon icon={faStar} /></p>
                        <p>Đánh giá:</p>
                        <p>{calculatorRatingStarProduct() ? calculatorRatingStarProduct().toFixed(1) : 0} ({shop.numberFeedback ? formatNumber(shop.numberFeedback) : 0} Đánh giá)</p>
                    </Space>
                    <Space align="center">
                        <p><FontAwesomeIcon icon={faUserPlus} /></p>
                        <p>Tham gia:</p>
                        <p>{moment(shop.dateCreate).fromNow()}</p>
                    </Space>
                </Space>
            </Col>
        </Row>
    )
}

export default GeneralDescription;