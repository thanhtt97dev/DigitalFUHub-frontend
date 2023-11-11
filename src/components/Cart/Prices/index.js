import React, { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import { formatPrice } from '~/utils';
import { addOrder } from '~/api/order';
import { deleteCart } from '~/api/cart';
import { formatNumberToK } from '~/utils';
import { useAuthUser } from 'react-auth-kit';
import { getCustomerBalance } from '~/api/user';
import { EuroCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Button, Col, Typography, Checkbox, Divider, Card, Space } from 'antd';
import {
    RESPONSE_CODE_SUCCESS, RESPONSE_CODE_ORDER_COUPON_NOT_EXISTED, RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY,
    RESPONSE_MESSAGE_ORDER_COUPON_NOT_EXISTED, RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY, RESPONSE_CODE_CART_SUCCESS,
    RESPONSE_CODE_ORDER_NOT_ELIGIBLE, RESPONSE_CODE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP, RESPONSE_CODE_ORDER_PRODUCT_HAS_BEEN_BANED,
    RESPONSE_CODE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT, RESPONSE_MESSAGE_ORDER_NOT_ELIGIBLE, RESPONSE_MESSAGE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP,
    RESPONSE_MESSAGE_ORDER_PRODUCT_HAS_BEEN_BANED, RESPONSE_MESSAGE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT,
    RESPONSE_CODE_ORDER_COUPON_INVALID_PRODUCT_APPLY, RESPONSE_MESSAGE_ORDER_COUPON_INVALID_PRODUCT_APPLY
} from '~/constants';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const Prices = ({ dataPropPriceComponent }) => {
    /// distructuring props
    const {
        carts,
        totalPrice,
        userCoin,
        setIsUseCoin,
        isUseCoin,
        reloadCarts,
        cartDetailIdSelecteds,
        setCartDetailIdSelecteds,
        getCouponCodeSelecteds,
    } = dataPropPriceComponent;
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    const [isOpenModalConfirmationBuy, setIsOpenModalConfirmationBuy] = useState(false);
    const [isOpenModalConfirmationDelete, setIsOpenModalConfirmationDelete] = useState(false);
    const [balance, setBalance] = useState(0);
    const [isLoadingButtonBuy, setIsLoadingButtonBuy] = useState(false);
    const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
    ///

    /// contexts
    const notification = useContext(NotificationContext);
    ///

    /// styles
    const styleCardItem = {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
    }
    ///


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

    const showModalConfirmationDelete = () => {
        setIsOpenModalConfirmationDelete(true);
    };

    const closeModalConfirmationDelete = () => {
        setIsOpenModalConfirmationDelete(false);
    };
    //

    /// useEffects
    useEffect(() => {
        if (user === null || user === undefined) return;

        getCustomerBalance(user.id)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        if (balance !== data.result) {
                            setBalance(data.result)
                        }
                    }
                }
            }).catch((err) => {
                console.log(err.message)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    ///

    //handles

    const loadingButtonBuy = () => {
        setIsLoadingButtonBuy(true);
    }

    const unLoadingButtonBuy = () => {
        setIsLoadingButtonBuy(false);
    }

    const loadingButtonDelete = () => {
        setIsLoadingButtonDelete(true);
    }

    const unLoadingButtonDelete = () => {
        setIsLoadingButtonDelete(false);
    }
    const handleBuy = () => {
        if (balance < totalPrice.discountPrice) {
            setContentModalAlert('Số dư không đủ, vui lòng nạp thêm tiền vào tài khoản')
            openModalAlert();
            return;
        }
        showModalConfirmationBuy();
    }

    const handleDeleteCartDetailSelecteds = () => {
        showModalConfirmationDelete();
    }


    const handleUseCoin = (e) => {
        setIsUseCoin(e.target.checked);
    }

    const handleOkConfirmationBuy = () => {
        if (user === null || user === undefined) return;

        // is loading button
        loadingButtonBuy();
        // create shop product request add order DTO
        //data add order
        const shopProductRequest = [];
        //data remove cart
        const dataRemoveCart = [];

        for (let i = 0; i < carts.length; i++) {
            const cartDetails = carts[i].products;
            const cartDetailsFil = cartDetails.filter(x => cartDetailIdSelecteds.includes(x.cartDetailId));
            if (cartDetailsFil) {
                // add order dto
                const shopProduct = {
                    shopId: carts[i].shopId,
                    products: cartDetailsFil.map(x => ({ productVariantId: x.productVariantId, quantity: x.quantity })),
                    coupon: getCouponCodeSelecteds(carts[i].shopId)
                };

                // remove cart dto
                const deleteCart = {
                    cartId: carts[i].cartId,
                    cartDetailIds: cartDetailsFil.map(x => (x.cartDetailId)),
                }

                shopProductRequest.push(shopProduct);
                dataRemoveCart.push(deleteCart)
            }
        }


        const finalDataOrder = {
            userId: user.id,
            shopProducts: shopProductRequest,
            isUseCoin: isUseCoin
        }


        addOrder(finalDataOrder)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        // delete cart selecteds
                        deleteCart(dataRemoveCart)
                            .then((res) => {
                                if (res.status === 200) {
                                    const data = res.data;
                                    if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS) {
                                        setCartDetailIdSelecteds([]);
                                        unLoadingButtonBuy();
                                    }
                                }
                            })
                            .catch((errors) => {
                                console.log(errors)
                            }).finally(() => {
                                setTimeout(() => {
                                    closeModalConfirmationBuy();
                                    reloadCarts();
                                }, 500)
                            })
                    } else {
                        if (data.status.responseCode === RESPONSE_CODE_ORDER_COUPON_NOT_EXISTED) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_COUPON_NOT_EXISTED)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY + ` (Còn ${data.result} sản phẩm)`)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_NOT_ELIGIBLE) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_NOT_ELIGIBLE);
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_PRODUCT_VARIANT_NOT_IN_SHOP);
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_PRODUCT_HAS_BEEN_BANED) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_PRODUCT_HAS_BEEN_BANED);
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_CUSTOMER_BUY_THEIR_OWN_PRODUCT);
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_COUPON_INVALID_PRODUCT_APPLY) {
                            setContentModalAlert(RESPONSE_MESSAGE_ORDER_COUPON_INVALID_PRODUCT_APPLY);
                        } else {
                            setContentModalAlert("Có lỗi xảy ra! Vui lòng thử lại sau!");
                        }
                        openModalAlert();
                        unLoadingButtonBuy();
                        closeModalConfirmationBuy();
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
    }


    const handleOkConfirmationDelete = () => {
        // Is loading button delete
        loadingButtonDelete();

        //data remove cart
        const dataRemoveCart = [];

        // get data remove carts
        for (let i = 0; i < carts.length; i++) {
            const cartDetails = carts[i].products;
            const cartDetailsFil = cartDetails.filter(x => cartDetailIdSelecteds.includes(x.cartDetailId));
            if (cartDetailsFil) {
                // remove cart dto
                const deleteCart = {
                    cartId: carts[i].cartId,
                    cartDetailIds: cartDetailsFil.map(x => (x.cartDetailId)),
                }
                dataRemoveCart.push(deleteCart)
            }
        }

        // delete cart selecteds
        deleteCart(dataRemoveCart)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS) {
                        unLoadingButtonDelete();
                    }
                }
            })
            .catch((errors) => {
                console.log(errors)
            }).finally(() => {
                setTimeout(() => {
                    closeModalConfirmationDelete();
                    reloadCarts();
                }, 500)
            })
    }
    ///

    return (
        <>
            <Col span={6} style={{ padding: 5 }}>
                <Card
                    style={{
                        width: '100%',
                        minHeight: '60vh',
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
                    <Button type="primary" disabled={totalPrice.originPrice > 0 ? false : true} block onClick={handleBuy} style={{ marginBottom: 10 }}>
                        Mua hàng
                    </Button>
                    <Button icon={<DeleteOutlined />} danger disabled={totalPrice.originPrice > 0 ? false : true} block onClick={handleDeleteCartDetailSelecteds} style={{ marginBottom: 30 }}>
                        Xóa ({cartDetailIdSelecteds.length > 0 ? cartDetailIdSelecteds.length : 0})
                    </Button>
                    <Card style={styleCardItem}>
                        <Space align='center' size={15}>
                            <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                Số dư còn lại
                            </Text>
                            <p style={{
                                whiteSpace: 'nowrap',
                                fontSize: '20px',
                                color: '#007bff',
                                maxWidth: '130px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                                title={formatPrice(balance)}
                            >
                                {formatPrice(balance)}
                            </p>
                        </Space>
                    </Card>
                </Card>
            </Col>

            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
            <ModalConfirmation title='Thanh toán'
                isOpen={isOpenModalConfirmationBuy}
                onOk={handleOkConfirmationBuy}
                onCancel={closeModalConfirmationBuy}
                contentModal={`Bạn có muốn thanh toán đơn hàng này với giá ${formatPrice(totalPrice.discountPrice)} không?`}
                contentButtonCancel='Quay lại'
                contentButtonOk='Thanh toán'
                isLoading={isLoadingButtonBuy} />

            <ModalConfirmation title='Xóa sản phẩm khỏi giỏ hàng'
                isOpen={isOpenModalConfirmationDelete}
                onOk={handleOkConfirmationDelete}
                onCancel={closeModalConfirmationDelete}
                contentModal={`Bạn có muốn bỏ ${cartDetailIdSelecteds.length} sản phẩm không?`}
                contentButtonCancel='Trở lại'
                contentButtonOk='Có'
                isLoading={isLoadingButtonDelete} />
        </>

    )
}

export default Prices

