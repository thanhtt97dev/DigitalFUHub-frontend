import React, { useEffect, useState } from "react";
import { getShopDetail } from "~/api/shop";
import { useParams } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import classNames from 'classnames/bind';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { discountPrice, formatPrice, formatNumber } from '~/utils';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Radio, Card, Typography, Space, Rate, Avatar } from 'antd';


///
const cx = classNames.bind(styles);
///


const DetailedDescription = ({ shop }) => {


    return (
        <div className={cx('container-page-detail')}>
            <Card className={cx('margin-bottom-10')} style={{ borderRadius: 2, boxShadow: '#d3d3d3 0px 1px 2px 0px' }} bodyStyle={{ padding: 20 }} >
                <Row>
                    <Col span={5}>
                        <p className={cx('text-title')}>THÔNG TIN CỬA HÀNG</p>
                    </Col>
                    <Col span={23}
                        offset={1}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: shop.description }} />
                    </Col>
                </Row>
            </Card>
        </div>)
}

export default DetailedDescription;