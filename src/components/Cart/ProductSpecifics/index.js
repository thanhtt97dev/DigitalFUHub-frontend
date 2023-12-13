import moment from 'moment';
import React, { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import Spinning from "~/components/Spinning";
import { formatPrice, getVietnamCurrentTime } from '~/utils';
import { useNavigate, Link } from "react-router-dom";
import { getCouponPrivate } from '~/api/coupon';
import { Typography, Modal, List, Input, Radio, Button, Space, Image, Row, Col } from 'antd';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_SUCCESS, COUPON_TYPE_SPECIFIC_PRODUCTS } from '~/constants';

///
const { Search } = Input;
const cx = classNames.bind(styles);
///

/// styles
const styleScrollProductSpecifics = {
    height: 400,
    overflow: 'auto',
    padding: '0 16px',
    border: '1px solid rgba(140, 140, 140, 0.35)',
}
///
const ProductSpecifics = ({ isOpenModalProductSpecifics,
    setIsOpenModalProductSpecifics,
    productSpecifics,
    isSpinningProductSpecifics,
    searchParam,
    setSearchParam
}) => {
    /// states
    const [inputProductName, setInputProductName] = useState('');
    const navigate = useNavigate();
    ///

    /// handles
    const handleChangeInputProductName = (e) => {
        setInputProductName(e.target.value)
    }

    const onSearchCoupon = () => {
        setSearchParam({ ...searchParam, productName: inputProductName })
    }

    const handleViewDetailProduct = (productId) => {
        return navigate(`/product/${productId}`)
    }
    ///
    return (<Modal
        title="Danh sách những sản phẩm đặc biệt sử dụng mã giảm giá"
        open={isOpenModalProductSpecifics}
        closable={false}
        footer={[
            <Button key="submit" type="primary" onClick={() => setIsOpenModalProductSpecifics(false)}>
                OK
            </Button>,
        ]}
    >
        <Spinning spinning={isSpinningProductSpecifics}>
            <Search
                placeholder="Nhập tên sản phẩm"
                enterButton="Tìm kiếm"
                size="large"
                onSearch={onSearchCoupon}
                onChange={handleChangeInputProductName}
                value={inputProductName}
            />

            <Row style={{ width: '100%', padding: 16, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
                <Col span={2} className={cx('flex-item-center')}>Mã</Col>
                <Col span={8} className={cx('flex-item-center')}>Ảnh</Col>
                <Col span={8} className={cx('flex-item-center')}><p>Tên sản phẩm</p></Col>
                <Col span={6} className={cx('flex-item-center')}></Col>
            </Row>
            <div
                id="scrollableDiv"
                style={styleScrollProductSpecifics}
            >
                <List
                    dataSource={productSpecifics}
                    renderItem={(item) => (
                        <List.Item>
                            <Row style={{ width: '100%', borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
                                <Col span={2} className={cx('flex-item-center')}><p>{item.productId}</p></Col>
                                <Col span={8} className={cx('flex-item-center')}><Image width={80} height={80} src={item.thumbnail} /></Col>
                                <Col span={8} className={cx('flex-item-center')}><p>{item.productName}</p></Col>
                                <Col span={6} className={cx('flex-item-center')}><Button type='link' onClick={() => handleViewDetailProduct(item.productId)}>Xem chi tiết</Button></Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </div>
        </Spinning>
    </Modal>)
}

export default ProductSpecifics;