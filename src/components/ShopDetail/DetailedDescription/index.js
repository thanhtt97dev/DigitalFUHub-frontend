import React, { useEffect, useState } from "react";
import { getShopDetail } from "~/api/shop";
import { useParams } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { discountPrice, formatPrice, formatNumber } from '~/utils';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Radio, Card, Typography, Space, Rate, Avatar } from 'antd';


///
const cx = classNames.bind(styles);
const { Title, Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
///


const DetailedDescription = ({ shop }) => {


    return (<Card className={cx('margin-bottom')}>
        <Row
        >
            <Col span={5}>
                <Title level={4}>Chi tiết cửa hàng</Title>
            </Col>
            <Col span={23}
                offset={1}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <div dangerouslySetInnerHTML={{ __html: shop.description }} />
            </Col>

        </Row>
    </Card>)
}

export default DetailedDescription;