import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from '~/pages/Cart/Cart.module.scss';
import { formatPrice } from '~/utils';
import { useNavigate, Link } from "react-router-dom";
import { getCouponPrivate } from '~/api/coupon';
import { Modal, List, Input, Radio, Button, Space } from 'antd';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_SUCCESS, COUPON_TYPE_SPECIFIC_PRODUCTS } from '~/constants';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';

///
const cx = classNames.bind(styles);
///

/// styles
const styleCouponType = {
    marginTop: 5,
    marginBottom: 5,
    width: 'fit-content'
}

const styleScrollCouponList = {
    height: 400,
    overflow: 'auto',
    padding: '0 16px',
    border: '1px solid rgba(140, 140, 140, 0.35)',
}
///

const Coupons = ({ dataPropCouponComponent }) => {

    /// distructuring props
    const {
        isOpenModalCoupons,
        closeModalCoupons,
        coupons,
        setCoupons,
        couponSelecteds,
        setCouponSelecteds,
        shopIdSelected,
        cartDetails,
        cartDetailIdSelecteds,
        cartItemSelecteds
    } = dataPropCouponComponent;
    ///

    /// states
    const [inputCouponCode, setInputCouponCode] = useState('');
    const [isSearchCoupon, setIsSearchCoupon] = useState(false);
    const [isCouponInfoSuccess, setIsCouponInfoSuccess] = useState(false);
    const [couponCodeSelected, setCouponCodeSelected] = useState({});
    const navigate = useNavigate();
    ///

    // contexts
    const notification = useContext(NotificationContext);
    //


    /// handles
    const handleSearchCoupon = () => {
        setIsSearchCoupon(!isSearchCoupon);
    }

    const handleChangeInputCode = (e) => {
        setInputCouponCode(e.target.value)
    }

    const onChangeCoupon = (e) => {
        setCouponCodeSelected(e.target.value);
    };

    const onClickRadioCoupon = (e) => {
        const value = e.target.value;
        if (value === couponCodeSelected) {
            setCouponCodeSelected(undefined);
        }
    }

    const onSearchCoupon = () => {
        setIsCouponInfoSuccess(true);

        getCouponPrivate(inputCouponCode, shopIdSelected)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const coupon = data.result;
                        if (coupon) {
                            const couponFind = coupons.find(x => x.couponCode === coupon.couponCode);
                            // add coupon private
                            if (!couponFind) {
                                setCoupons((prev) => [coupon, ...prev]);
                            }
                        }
                    }
                }
            })
            .catch((error) => { })
            .finally(() => {
                setTimeout(() => {
                    setIsCouponInfoSuccess(false)
                }, 500)
            });
    }

    const chooseModalCoupon = () => {
        if (couponCodeSelected) {
            // filter coupon of current shop
            const couponCodeSelectedsFil = couponSelecteds.filter(x => !coupons.some(y => y.couponCode === x.couponCode));

            // find coupon and add
            const couponFind = coupons.find(x => x.couponCode === couponCodeSelected)
            setCouponSelecteds([...couponCodeSelectedsFil
                , {
                shopId: couponFind.shopId,
                couponCode: couponFind.couponCode,
                priceDiscount: couponFind.priceDiscount,
                minTotalOrderValue: couponFind.minTotalOrderValue,
                productIds: couponFind.productIds,
                quantity: couponFind.quantity,
                couponTypeId: couponFind.couponTypeId,
                isPublic: couponFind.isPublic
                // inputCouponCode: couponFind.isPublic ? '' : inputCouponCode
            }]);
        } else {
            const newCouponCodeSelecteds = couponSelecteds.filter(x => x.shopId !== shopIdSelected);
            setCouponSelecteds(newCouponCodeSelecteds)
        }

        closeModalCoupons();
    }
    ///

    useEffect(() => {
        if (isOpenModalCoupons) {
            const couponSelectedsFind = couponSelecteds.find(x => x.shopId === shopIdSelected);
            if (couponSelectedsFind) {
                // set coupon code selected
                setCouponCodeSelected(couponSelectedsFind.couponCode);

                if (!couponSelectedsFind.isPublic) {
                    setInputCouponCode(couponSelectedsFind.couponCode);

                    // search coupon
                    handleSearchCoupon();
                } else {
                    setInputCouponCode('');
                }
            }
        } else {
            setCouponCodeSelected('');
            setInputCouponCode('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenModalCoupons])

    useEffect(() => {
        // search coupon
        onSearchCoupon();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchCoupon])
    ///

    /// functions
    const isSatisfyCouponTypeSpecificProduct = (productIds) => {
        const cartDetailSelecteds = cartDetails.filter(x => cartDetailIdSelecteds.includes(x.cartDetailId));
        if (cartDetailSelecteds) {
            const cartDetailSelectedFil = cartDetailSelecteds.filter(x => productIds.includes(x.productId));
            if (cartDetailSelectedFil.length > 0) {
                return true;
            }
        }
        return false;
    }

    const isCartPriceLessThanMinTotalOrderValue = (minTotalOrderValue) => {
        const cartItemSelectedFind = cartItemSelecteds.find(x => x.shopId === shopIdSelected);
        if (cartItemSelectedFind) {
            return cartItemSelectedFind.totalPrice < minTotalOrderValue;
        } else {
            return true;
        }
    }

    const isCartItemSelectedNotFound = () => {
        const cartItemSelectedFind = cartItemSelecteds.find(x => x.shopId === shopIdSelected);
        if (!cartItemSelectedFind) {
            return true;
        } else {
            return false;
        }
    }
    ///

    return (
        <Modal
            title="Mã giảm giá của Shop"
            open={isOpenModalCoupons}
            onOk={chooseModalCoupon}
            onCancel={closeModalCoupons}
        >
            <Spinning spinning={isCouponInfoSuccess}>
                <Input
                    placeholder="Nhập mã Code"
                    size="large"
                    value={inputCouponCode}
                    onChange={handleChangeInputCode}
                    className={cx('margin-bottom-item')}
                    disabled={isCartItemSelectedNotFound() ? true : false}
                    suffix={
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            htmlType="submit"
                            onClick={onSearchCoupon}
                            disabled={(inputCouponCode === undefined || inputCouponCode.length === 0)}
                        />
                    }
                />
                <Radio.Group onChange={onChangeCoupon} value={couponCodeSelected} style={{ display: 'block' }} >

                    <div
                        id="scrollableDiv"
                        style={styleScrollCouponList}
                    >
                        <List
                            dataSource={coupons}
                            renderItem={(item) => (
                                <>
                                    <List.Item style={{ borderBottom: '1px solid #ddd' }} key={item.couponId} className={isCartItemSelectedNotFound() ? cx('opacity-disabled') : {}}>
                                        <List.Item.Meta
                                            title={<Space><p>{item.couponName}</p><Button size='small' type="primary" ghost style={styleCouponType}>{item.couponCode}</Button></Space>}
                                            description={
                                                (<Space>
                                                    <Space.Compact direction='vertical'>
                                                        <Space align='center'>
                                                            <p>Giảm {formatPrice(item.priceDiscount)}</p><p>-</p><p style={{ color: 'red' }}>Đơn tối thiểu {formatPrice(item.minTotalOrderValue)}</p>
                                                        </Space>
                                                        <Space align='center' size={40}>
                                                            {
                                                                item.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS ?
                                                                    <Button size='small' danger style={styleCouponType}>Sản phẩm nhất định</Button> : <></>
                                                            }
                                                            {
                                                                item.quantity > 0 ? (<p>HSD: {moment(item.endDate).format('DD.MM.YYYY')}</p>) : (<Button size='small' danger style={styleCouponType}> Đã hết</Button>)
                                                            }
                                                        </Space>

                                                    </Space.Compact>
                                                </Space>)
                                            }
                                        >
                                        </List.Item.Meta>
                                        <Space direction='vertical' size={20} style={{ textAlign: 'center' }}>
                                            {
                                                item.quantity <= 0 || isCartPriceLessThanMinTotalOrderValue(item.minTotalOrderValue) ?
                                                    <Radio disabled={true}
                                                        value={item.couponCode} onClick={onClickRadioCoupon}></Radio>
                                                    : item.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS ? (isSatisfyCouponTypeSpecificProduct(item.productIds) ?
                                                        <Radio disabled={false}
                                                            value={item.couponCode} onClick={onClickRadioCoupon}></Radio>
                                                        : <Radio disabled={true}
                                                            value={item.couponCode} onClick={onClickRadioCoupon}></Radio>)
                                                        : <Radio disabled={false}
                                                            value={item.couponCode} onClick={onClickRadioCoupon}></Radio>
                                            }
                                            <Link to={`/coupon/${item.couponId}`} target='_blank'><p style={{ fontSize: 13 }}>Điều kiện</p></Link>
                                        </Space>

                                    </List.Item>
                                    {
                                        isCartItemSelectedNotFound() ?
                                            (<Space className={cx('warning-coupon')}><ExclamationCircleOutlined /><p>Vui lòng chọn sản phẩm từ shop để áp dụng mã giảm giá này</p></Space>)
                                            : (<></>)
                                    }
                                </>
                            )}
                        />
                    </div>
                </Radio.Group>
            </Spinning>
        </Modal>
    )
}

export default Coupons;

