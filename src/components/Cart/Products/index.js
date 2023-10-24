import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
// import NumericInput from '../NumericInput';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import Coupons from '../Coupons'
import { formatPrice, discountPrice } from '~/utils';
import { Link } from 'react-router-dom';
import { updateCart, deleteCart } from '~/api/cart';
import { getCouponPublic } from '~/api/coupon';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification, Input } from 'antd';
import { CopyrightOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import {
    RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_INVALID_QUANTITY,
    RESPONSE_MESSAGE_CART_NOT_FOUND, RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_CART_SUCCESS
} from '~/constants';

const { Text } = Typography;
const cx = classNames.bind(styles);



const Products = ({ dataPropProductComponent }) => {
    // distructuring props
    const {
        userId,
        carts,
        handleOnChangeCheckbox,
        cartDetailIdSelecteds,
        handleCheckAll,
        reloadCarts,
        couponCodeSelecteds,
        setCouponCodeSelecteds,
        coupons,
        setCoupons,
        handleCheckAllGroup,
        checkAllGroup,
    } = dataPropProductComponent;
    //

    //states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    const [isOpenModalCoupons, setIsOpenModalCoupons] = useState(false);
    const [shopIdSelected, setShopIdSelected] = useState(0);


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
    const openModalCoupons = () => {
        setIsOpenModalCoupons(true);
    }

    const closeModalCoupons = () => {
        setIsOpenModalCoupons(false);
    }
    //


    // checkbox all
    const checkAll = cartDetailIdSelecteds.length === carts.length
    const indeterminate = cartDetailIdSelecteds.length > 0 && cartDetailIdSelecteds.length < carts.length;
    //


    // handles
    const handleMinusOne = (quantity, cartDetailId, productVariantId) => {
        updateCart({ userId: userId, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: (quantity - 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.status.responseCode === RESPONSE_CODE_CART_INVALID_QUANTITY) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_INVALID_QUANTITY)
                        openModalAlert();
                    }
                    reloadCarts();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleAddOne = (quantity, cartDetailId, productVariantId) => {
        updateCart({ userId: userId, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: (quantity + 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.status.responseCode === RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY)
                        openModalAlert();
                    }
                    reloadCarts();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const onBlurQuantity = (e, cartDetailId, productVariantId) => {
        const value = e.target.value
        updateCart({ userId: userId, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: value })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.status.responseCode === RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY)
                        openModalAlert();
                    }
                    reloadCarts();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const showCouponShop = (shopId) => {

        getCouponPublic(shopId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setCoupons(data.result);
                    openModalCoupons();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const deleteCartDetail = (cartDetailId) => {

        deleteCart(cartDetailId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_NOT_FOUND)
                        openModalAlert();
                    } else if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS) {
                        reloadCarts();
                    }
                }
            })
            .catch((errors) => {
                console.log(errors)
                notification("error", "Lỗi", "Có lỗi trong quá trình xóa, vui lòng thử lại");
            })
    };
    ///

    /// styles
    const styleCardHeader = { marginBottom: 10 }
    const styleCardBodyHeader = { padding: 20 }

    const styleCardCartItem = { marginBottom: 10 }
    const styleCardHeadCartItem = { paddingLeft: 20 }
    const styleCardBodyCartItem = { padding: 20 }
    ///

    /// components custom
    const NumericInput = ({ value, onBlur }) => {
        const [quantity, setQuantity] = useState(value);

        const handleChange = (e) => {

            const reg = /^[1-9]\d*$/;
            const targetValue = e.target.value
            if (reg.test(targetValue)) {
                setQuantity(e.target.value)
            }
        }

        return (
            <Input
                className={cx('input-num')}
                value={quantity}
                onChange={handleChange}
                onBlur={onBlur}
            />
        );
    };
    ///

    /// props
    const dataPropCouponComponent = {
        isOpenModalCoupons: isOpenModalCoupons,
        coupons: coupons,
        closeModalCoupons: closeModalCoupons,
        couponCodeSelecteds: couponCodeSelecteds,
        setCouponCodeSelecteds: setCouponCodeSelecteds,
        setCoupons: setCoupons,
        shopIdSelected: shopIdSelected
    }

    ///
    return (
        <>
            <Col span={18} style={{ padding: 5 }}>
                <Card bodyStyle={styleCardBodyHeader} style={styleCardHeader}>
                    <Row style={{ height: '3vh' }}>
                        <Col><Checkbox onChange={handleCheckAll} ></Checkbox></Col>
                        <Col offset={5}>Sản phẩm</Col>
                        <Col offset={7}>Đơn giá</Col>
                        <Col offset={1}>Số Lượng</Col>
                        <Col offset={2}>Số Tiền</Col>
                        <Col offset={1}>Thao Tác</Col>
                    </Row>
                </Card>
                <Checkbox.Group onChange={handleOnChangeCheckbox} style={{ display: 'block' }} >
                    {
                        carts.map((cart, index) => (
                            <Card
                                hoverable
                                title={<><Checkbox value={cart.cartDetailId}></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}</>}
                                key={index} bodyStyle={styleCardBodyCartItem} headStyle={styleCardHeadCartItem} style={styleCardCartItem}>
                                {
                                    cart.products.map((product, index) => (
                                        <Row className={cx('margin-bottom-item')} key={index}>
                                            <Col >
                                                <Checkbox value={product.cartDetailId}></Checkbox>
                                            </Col>

                                            <Col offset={1}>
                                                <Image
                                                    width={80}
                                                    src={product.productThumbnail}
                                                />
                                            </Col>
                                            <Col offset={1}><Link to={'/product/' + product.productId} >{product.productName}</Link></Col>
                                            <Col offset={1}><Text type="secondary">Loại: {product.productVariantName}</Text></Col>
                                            <Col offset={1}><Text type="secondary" delete>{formatPrice(product.productVariantPrice)}</Text></Col>
                                            <Col offset={1}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productDiscount))}</Text></Col>
                                            <Col offset={1}>
                                                <div>
                                                    <Button disabled={product.quantity === 1 ? true : false} onClick={() => handleMinusOne(product.quantity, product.cartDetailId, product.productVariantId)}>-</Button>
                                                    <NumericInput value={product.quantity} onBlur={(e) => onBlurQuantity(e, product.cartDetailId, product.productVariantId)} />
                                                    <Button disabled={product.quantity === product.productVariantQuantity ? true : false} onClick={() => handleAddOne(product.quantity, product.cartDetailId, product.productVariantId)}>+</Button>

                                                </div>

                                            </Col>
                                            <Col offset={1}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productDiscount) * product.quantity)}</Text></Col>
                                            <Col offset={1}><Button icon={<DeleteOutlined />} danger onClick={() => deleteCartDetail(product.cartDetailId)}>Xóa</Button></Col>
                                        </Row>
                                    ))
                                }
                                <Row>
                                    <Col offset={1}><Button type="link" onClick={() => { setShopIdSelected(cart.shopId); showCouponShop(cart.shopId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                    <Col>{
                                        // cart.coupons?.map((item) => (
                                        //     <p>{item.price}</p>
                                        // ))
                                    }</Col>
                                </Row>

                            </Card>
                        ))
                    }
                </Checkbox.Group>
            </Col>

            <Coupons dataPropCouponComponent={dataPropCouponComponent} />
            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
            <ModalConfirmation />
        </>

    )
}

export default Products