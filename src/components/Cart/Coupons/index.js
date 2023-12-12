import moment from 'moment';
import React, { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import Spinning from "~/components/Spinning";
import { formatPrice, getVietnamCurrentTime } from '~/utils';
import { getCouponPrivate } from '~/api/coupon';
import { Typography, Modal, List, Input, Radio, Button, Space } from 'antd';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_SUCCESS, COUPON_TYPE_SPECIFIC_PRODUCTS } from '~/constants';

///
const { Search } = Input;
const { Text } = Typography;
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
        totalPrice,
        cartDetails,
        cartDetailIdSelecteds,
        cartItemSelecteds
    } = dataPropCouponComponent;
    ///

    /// states
    const [inputCouponCode, setInputCouponCode] = useState('');
    const [isCouponInfoSuccess, setIsCouponInfoSuccess] = useState(false);
    const [couponCodeSelected, setCouponCodeSelected] = useState({});
    ///

    // contexts
    const notification = useContext(NotificationContext);
    //


    /// handles

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
        if (!inputCouponCode) {
            notification("error", "Vui lòng nhập Code để tìm kiếm mã giảm giá.")
            return;
        }

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
                                setCoupons((prev) => [...prev, coupon]);
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
                shopId: shopIdSelected,
                couponCode: couponCodeSelected,
                priceDiscount: couponFind.priceDiscount,
                minTotalOrderValue: couponFind.minTotalOrderValue,
                productIds: couponFind.productIds,
                quantity: couponFind.quantity,
                couponTypeId: couponFind.couponTypeId
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
            if (couponSelectedsFind) setCouponCodeSelected(couponSelectedsFind.couponCode);
        } else {
            setCouponCodeSelected('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenModalCoupons])
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
    ///

    return (
        <Modal
            title="Mã giảm giá của Shop"
            open={isOpenModalCoupons}
            onOk={chooseModalCoupon}
            onCancel={closeModalCoupons}
        >
            <Spinning spinning={isCouponInfoSuccess}>
                <Search
                    placeholder="Nhập mã Code"
                    allowClear
                    enterButton="Tìm kiếm"
                    size="large"
                    onSearch={onSearchCoupon}
                    value={inputCouponCode}
                    onChange={handleChangeInputCode}
                    className={cx('margin-bottom-item')}
                />
                <Radio.Group onChange={onChangeCoupon} value={couponCodeSelected} style={{ display: 'block' }} >

                    <div
                        id="scrollableDiv"
                        style={styleScrollCouponList}
                    >
                        <List
                            dataSource={coupons}
                            renderItem={(item) => (
                                <List.Item key={item.couponId}>
                                    <List.Item.Meta
                                        title={item.couponName}
                                        description={
                                            (<Space>
                                                <Space.Compact direction='vertical'>
                                                    <Space align='center'>
                                                        <p>Giảm {formatPrice(item.priceDiscount)}</p><p>-</p><p style={{ color: 'red' }}>Đơn tối thiểu {formatPrice(item.minTotalOrderValue)}</p>
                                                    </Space>
                                                    {
                                                        item.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS ?
                                                            <Button size='small' danger style={styleCouponType}>Sản phẩm nhất định</Button> : <></>
                                                    }
                                                    <p>
                                                        {
                                                            item.quantity > 0 ? (
                                                                moment(item.endDate).diff(moment(getVietnamCurrentTime()), 'days') <= 2 ?
                                                                    (<Text type="danger"> HSD: {moment(item.endDate).format('DD.MM.YYYY')} (Sắp hết hạn)</Text>)
                                                                    : (<> HSD: {moment(item.endDate).format('DD.MM.YYYY')}</>)) : (<Text type="danger"> Đã hết</Text>)
                                                        }
                                                    </p>
                                                </Space.Compact>
                                            </Space>)
                                        }
                                    />
                                    <div>
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
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </Radio.Group>
            </Spinning>
        </Modal>
    )
}

export default Coupons;

