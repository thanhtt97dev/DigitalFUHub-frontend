import React, { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import { formatPrice } from '~/utils';
import { addOrder } from '~/api/order';
import { deleteCart } from '~/api/cart';
import { NotificationContext } from "~/context/NotificationContext";
import { Button, Col, Typography, Checkbox, Divider, Card } from 'antd';
import {
    RESPONSE_CODE_SUCCESS, RESPONSE_CODE_ORDER_COUPON_USED, RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY,
    RESPONSE_MESSAGE_ORDER_COUPON_USED, RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY
} from '~/constants';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const Prices = ({ dataPropPriceComponent }) => {
    // distructuring props
    const {
        userId,
        totalPrice,
        userCoin,
        balance,
        itemCartSelected,
        reloadCarts,
        setItemCartSelected
    } = dataPropPriceComponent;
    //

    // states
    const [isUseCoin, setIsUseCoin] = useState(false);
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
        const lstDataOrder = itemCartSelected.map((c) => ({
            productVariantId: c.productVariantId,
            quantity: c.quantity,
            coupons: c.coupons.map((coupon) => coupon.couponCode)
        }));

        const finalDataOrder = {
            userId: userId,
            products: lstDataOrder,
            isUseCoin: isUseCoin

        }

        addOrder(finalDataOrder)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    console.log('data: ' + JSON.stringify(data))
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification("success", "Thành công", "Thanh toán đơn hàng thành công")
                        itemCartSelected.map(item => {
                            return deleteCart({ userId: item.userId, productVariantId: item.productVariantId })
                                .then((res) => {
                                    if (res.status === 200) {
                                        setItemCartSelected([])
                                        reloadCarts();
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
    //

    return (
        <>
            <Col span={6} style={{ padding: 5 }}>
                <Card
                    style={{
                        width: '100%',
                        height: '55vh',
                    }}
                >
                    <Title level={4} className={cx('space-div-flex')}>Thanh toán</Title>
                    <div className={cx('space-div-flex')}>
                        <Text style={{}}>Tổng tiền hàng:</Text>&nbsp;&nbsp;
                        <Text strong>{formatPrice(totalPrice.originPrice)}</Text>
                    </div>
                    <div className={cx('space-div-flex')}>
                        <Text>Giảm giá sản phẩm:</Text>&nbsp;&nbsp;
                        <Text strong>- {formatPrice(totalPrice.originPrice - totalPrice.discountPrice)}</Text>
                    </div>
                    <div className={cx('space-div-flex')}>
                        <Text>Giảm giá của shop:</Text>&nbsp;&nbsp;
                        <Text strong>- {formatPrice(totalPrice.originPrice - totalPrice.discountPrice)}</Text>
                    </div>
                    <Divider />
                    <div className={cx('space-div-flex')} style={{ marginBottom: 30 }}>

                        <Text>Sử dụng xu:</Text>&nbsp;&nbsp;
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

            <ModalAlert />
            <ModalConfirmation />
        </>

    )
}

export default Prices

