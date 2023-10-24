import React, { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import { formatPrice } from '~/utils';
import { addOrder } from '~/api/order';
import { deleteCart } from '~/api/cart';
import { formatNumberToK } from '~/utils';
import { EuroCircleOutlined } from '@ant-design/icons';
import { NotificationContext } from "~/context/NotificationContext";
import { Button, Col, Typography, Checkbox, Divider, Card } from 'antd';
import {
    RESPONSE_CODE_SUCCESS, RESPONSE_CODE_ORDER_COUPON_USED, RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY,
    RESPONSE_MESSAGE_ORDER_COUPON_USED, RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY, RESPONSE_CODE_CART_SUCCESS
} from '~/constants';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const Prices = ({ dataPropPriceComponent }) => {
    // distructuring props
    const {
        userId,
        carts,
        totalPrice,
        userCoin,
        setIsUseCoin,
        balance,
        isUseCoin,
        reloadCarts,
        cartDetailIdSelecteds,
        couponCodeSelecteds
    } = dataPropPriceComponent;
    //

    // states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [isOpenModalConfirmationBuy, setIsOpenModalConfirmationBuy] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    //

    // contexts
    const notification = useContext(NotificationContext);
    //


    // modal Alert
    const openModalAlert = () => {
        setIsOpenModalAlert(true);
    }

    const closeModalAlert = () => {
        setIsOpenModalAlert(false);
    }
    //

    // modal confirmation
    const showModalConfirmationBuy = () => {
        setIsOpenModalConfirmationBuy(true);
    };

    const closeModalConfirmationBuy = () => {
        setIsOpenModalConfirmationBuy(false);
    };
    //

    //handles
    const handleBuy = () => {
        if (balance < totalPrice.discountPrice) {
            setContentModalAlert('Số dư không đủ, vui lòng nạp thêm tiền vào tài khoản')
            openModalAlert();
            return;
        }
        showModalConfirmationBuy();
    }


    const handleUseCoin = (e) => {
        setIsUseCoin(e.target.checked);
    }

    const handleOkConfirmationBuy = () => {

        // create shop product request add order DTO
        const shopProductRequest = [];

        for (let i = 0; i < carts.length; i++) {
            const cartDetails = carts[i].products;
            const cartDetailsFil = cartDetails.filter(x => cartDetailIdSelecteds.includes(x.cartDetailId));
            if (cartDetailsFil) {
                const shopProduct = {
                    shopId: carts[i].shopId,
                    products: cartDetailsFil.map(x => ({ productVariantId: x.productVariantId, quantity: x.quantity })),
                    coupon: couponCodeSelecteds.find(x => x.shopId === carts[i].shopId).couponCode
                };

                shopProductRequest.push(shopProduct);
            }
        }

        const finalDataOrder = {
            userId: userId,
            shopProducts: shopProductRequest,
            isUseCoin: isUseCoin
        }

        addOrder(finalDataOrder)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        cartDetailIdSelecteds.map(cartDetaiId => {
                            return deleteCart(cartDetaiId)
                                .then((res) => {
                                    if (res.status === 200) {
                                        const data = res.data;
                                        if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS) {
                                            reloadCarts();
                                        }
                                    }
                                })
                                .catch((errors) => {
                                    console.log(errors)
                                });
                        })
                    } else {
                        if (data.status.responseCode === RESPONSE_CODE_ORDER_COUPON_USED) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_COUPON_USED)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY)
                        }
                        openModalAlert();
                    }
                    closeModalConfirmationBuy();
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    ///

    return (
        <>
            <Col span={6} style={{ padding: 5 }}>
                <Card
                    style={{
                        width: '100%',
                        height: '60vh',
                    }}
                >
                    <Title level={4} className={cx('space-div-flex')}>Thanh toán</Title>
                    <div className={cx('space-div-flex')}>
                        <Text style={{}}>Tổng tiền hàng:</Text>&nbsp;&nbsp;
                        <Text strong>{formatPrice(totalPrice.originPrice)}</Text>
                    </div>
                    <div className={cx('space-div-flex')}>
                        <Text>Giảm giá sản phẩm:</Text>&nbsp;&nbsp;
                        <Text strong>- {formatPrice(totalPrice.totalPriceProductDiscount)}</Text>
                    </div>
                    <div className={cx('space-div-flex')}>
                        <Text>Giảm giá của shop:</Text>&nbsp;&nbsp;
                        <Text strong>- {formatPrice(totalPrice.totalPriceCouponDiscount)}</Text>
                    </div>
                    <div className={cx('space-div-flex')}>
                        <Text>Giảm giá từ Coin:</Text>&nbsp;&nbsp;
                        <Text strong>- {formatPrice(totalPrice.totalPriceCoinDiscount)}</Text>
                    </div>
                    <Divider />
                    <div className={cx('space-div-flex')} style={{ marginBottom: 30 }}>

                        <Text><EuroCircleOutlined />&nbsp;&nbsp;<Text type="warning">{formatNumberToK(userCoin)}</Text> - Sử dụng Coin:</Text>&nbsp;&nbsp;
                        <Checkbox disabled={userCoin !== 0 && totalPrice.originPrice > 0 ? false : true} onChange={handleUseCoin}></Checkbox>
                    </div>
                    <div className={cx('space-div-flex')} style={{ marginBottom: 30 }}>
                        <Text>Tổng giá trị phải thanh toán:</Text>&nbsp;&nbsp;
                        <Text strong>{formatPrice(totalPrice.discountPrice)}</Text>
                    </div>

                    <Button type="primary" disabled={totalPrice.originPrice > 0 ? false : true} block onClick={handleBuy}>
                        Mua hàng
                    </Button>
                </Card>
            </Col>

            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
            <ModalConfirmation title='Thanh toán'
                isOpen={isOpenModalConfirmationBuy}
                onOk={handleOkConfirmationBuy}
                onCancel={closeModalConfirmationBuy}
                content={`Bạn có muốn thanh toán đơn hàng này với giá ${formatPrice(totalPrice.discountPrice)} không?`} />
        </>

    )
}

export default Prices

