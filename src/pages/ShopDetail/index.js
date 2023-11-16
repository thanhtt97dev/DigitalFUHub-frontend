import React, { useEffect, useState, useRef } from "react";
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from './ShopDetail.module.scss';
import ProductList from "~/components/ShopDetail/ProductList";
import GeneralDescription from "~/components/ShopDetail/GeneralDescription";
import DetailedDescription from "~/components/ShopDetail/DetailedDescription";
import { getShopDetail } from "~/api/shop";
import { Tabs, Row } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';

///
const { TabPane } = Tabs;
const cx = classNames.bind(styles);
///

/// styles
const styleContainerTab = { backgroundColor: 'white', borderRadius: 2 };
const styleTabBar = { width: '100%' };
const styleTabPane = { width: '200px', color: '#d0011b', textAlign: 'center' };
///

const ShopDetail = () => {
    /// states
    const { userId } = useParams();
    const [shop, setShop] = useState({});
    const navigate = useNavigate();
    ///

    /// refs
    const productStartRef = useRef(null);
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

    return (<>
        <GeneralDescription shop={shop} userId={userId} />
        <div style={styleContainerTab} className={cx('margin-bottom-10')}>
            <Row className={cx('container-page-detail')}>
                <Tabs activeKey="1" tabBarStyle={styleTabBar} onChange={handleTabChange}>
                    <TabPane tab={<p className={cx('text-title')} style={styleTabPane}>THÔNG TIN CỬA HÀNG</p>} key="1" />
                    <TabPane tab={<p className={cx('text-title')} style={styleTabPane}>TẤT CẢ SẢN PHẨM</p>} key="2" />
                </Tabs>
            </Row>
        </div>
        <DetailedDescription shop={shop} />
        <div ref={productStartRef} />
        <ProductList userId={userId} />
    </>)
}

export default ShopDetail;