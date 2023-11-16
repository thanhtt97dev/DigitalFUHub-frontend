import React, { useEffect, useState, useRef } from "react";
import { getShopDetail } from "~/api/shop";
import classNames from 'classnames/bind';
import styles from './ShopDetail.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';
import GeneralDescription from "~/components/ShopDetail/GeneralDescription";
import DetailedDescription from "~/components/ShopDetail/DetailedDescription";
import ProductList from "~/components/ShopDetail/ProductList";
import { Tabs } from 'antd';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Card, Typography, Space, Rate, Avatar } from 'antd';

const { TabPane } = Tabs;
const cx = classNames.bind(styles);

const ShopDetail = () => {
    /// states
    const { userId } = useParams();
    const [shop, setShop] = useState({});
    const [keyActive, setKeyActive] = useState("1");
    const navigate = useNavigate();
    ///

    /// refs
    const productStartRef = useRef(null);
    const shopDetailStartRef = useRef(null);
    ///

    /// vars
    const currentPosition = window.scrollY;
    ///

    /// handles
    const handleTabChange = (key) => {
        if (key === "2") {
            productStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }


    ///

    /// useEffects
    useEffect(() => {

        getShopDetail(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setShop(result);
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        navigate('/notFound');
                    }
                }
            })

    }, [navigate, userId])


    // useEffect(() => {
    //     if (keyActive === "2") {
    //         if (shopDetailStartRef.current === currentPosition) {
    //             setKeyActive("1");
    //         }
    //     }
    // }, [currentPosition, keyActive])
    ///

    return (<>
        <div ref={shopDetailStartRef} />
        <GeneralDescription shop={shop} userId={userId} />
        <div style={{ backgroundColor: 'white', borderRadius: 2 }} className={cx('margin-bottom-10')}>
            <Row className={cx('container-page-detail')}>
                <Tabs activeKey={keyActive} tabBarStyle={{ width: '100%' }} onChange={handleTabChange}>
                    <TabPane tab={<p className={cx('text-title')} style={{ width: '200px', color: '#d0011b', textAlign: 'center' }}>THÔNG TIN CỬA HÀNG</p>} key="1" />
                    <TabPane tab={<p className={cx('text-title')} style={{ width: '200px', color: '#d0011b', textAlign: 'center' }}>TẤT CẢ SẢN PHẨM</p>} key="2" />
                </Tabs>
            </Row>
        </div>
        <DetailedDescription shop={shop} />
        <div ref={productStartRef} />
        <ProductList userId={userId} />
    </>)
}

export default ShopDetail;