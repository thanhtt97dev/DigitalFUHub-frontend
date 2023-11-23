import React, { useEffect, useState } from 'react';
import Coupons from '../Coupons';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { getCouponPublic } from '~/api/coupon';
import { formatPrice, discountPrice } from '~/utils';
import { updateCart, deleteCartDetail } from '~/api/cart';
import { CopyrightOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification, Input, Tag, Space } from 'antd';
import {
    RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_INVALID_QUANTITY,
    RESPONSE_MESSAGE_CART_NOT_FOUND, RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_CART_SUCCESS
} from '~/constants';

///
const { Text } = Typography;
const cx = classNames.bind(styles);
///

/// styles
const styleCardHeader = { marginBottom: 10 }
const styleCardBodyHeader = { padding: 20 }
const styleCardCartItem = { marginBottom: 10 }
const styleCardHeadCartItem = { paddingLeft: 20 }
const styleCardBodyCartItem = { padding: 20 }
///

const Products = ({ dataPropProductComponent }) => {
    /// distructuring props
    const {
        carts,
        cartDetailIdSelecteds,
        setCartDetailIdSelecteds,
        reloadCarts,
        couponCodeSelecteds,
        setCouponCodeSelecteds,
        coupons,
        totalPrice,
        setCoupons,
        getCouponCodeSelecteds,
        cartDetails
    } = dataPropProductComponent;
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    const [isOpenModalCoupons, setIsOpenModalCoupons] = useState(false);
    const [totalCartDetailValid, setTotalCartDetailValid] = useState(0);
    const [shopIdSelected, setShopIdSelected] = useState(0);
    const [cartIdSelecteds, setCartIdSelecteds] = useState([]);
    ///


    /// modal Alert
    const openModalAlert = () => {
        setIsOpenModalAlert(true);
    }

    const closeModalAlert = () => {
        setIsOpenModalAlert(false);
    }
    ///


    /// modal confirmation
    const openModalCoupons = () => {
        setIsOpenModalCoupons(true);
    }

    const closeModalCoupons = () => {
        setIsOpenModalCoupons(false);
    }
    ///

    /// handles
    const handleMinusOne = (quantity, cartDetailId, productVariantId) => {
        if (user === null || user === undefined) return;

        updateCart({ userId: user.id, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: (quantity - 1) })
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
        if (user === null || user === undefined) return;

        updateCart({ userId: user.id, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: (quantity + 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.status.responseCode === RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY + ` (Còn ${data.result} sản phẩm)`)
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
        if (user === null || user === undefined) return;

        const value = e.target.value
        updateCart({ userId: user.id, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: value })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.status.responseCode === RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY + ` (Còn ${data.result} sản phẩm)`)
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

    const funcDeleteCartDetail = (cartDetailId) => {

        deleteCartDetail(cartDetailId)
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
                notification("error", "Có lỗi trong quá trình xóa, vui lòng thử lại");
            })
    };

    const handleCheckAll = (e) => {

        if (e.target.checked) {
            const listCartDetailIds = [];
            // const listCartIds = [];
            for (let i = 0; i < cartDetails.length; i++) {
                // listCartIds.push(carts[i].cartId);
                // Add cart detail id 
                if (cartDetails[i].quantityProductRemaining > 0 && cartDetails[i].productActivate) {
                    listCartDetailIds.push(cartDetails[i].cartDetailId);
                }
            }

            // setCartIdSelecteds(listCartIds);
            setCartDetailIdSelecteds([].concat(...listCartDetailIds));
        } else {
            // setCartIdSelecteds([]);
            setCartDetailIdSelecteds([]);
        }
    }

    const handleOnChangeCheckboxCartItem = (cartId, e) => {

        let cartDetailIds = [];
        const cartFind = carts.find(x => x.cartId === cartId);
        if (!cartFind) return;
        const cartDetails = cartFind.products;
        for (let i = 0; i < cartDetails.length; i++) {
            if (cartDetails[i].quantityProductRemaining > 0 && cartDetails[i].productActivate) {
                cartDetailIds.push(cartDetails[i].cartDetailId);
            }
        }
        if (e.target.checked) {
            const newCartDetailIdSelecteds = cartDetailIdSelecteds.filter(x => !cartDetailIds.includes(x));
            setCartDetailIdSelecteds([...newCartDetailIdSelecteds, ...cartDetailIds]);
        } else {
            const newCartDetailIdSelecteds = cartDetailIdSelecteds.filter(x => !cartDetailIds.includes(x));
            setCartDetailIdSelecteds(newCartDetailIdSelecteds);
        }
    }

    const handleOnChangeCheckbox = (values) => {
        if (values.length === 0) {
            setCartDetailIdSelecteds([])
            return;
        }
        setCartDetailIdSelecteds([...values]);
    }
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

    /// useEffect 
    // calculator number cart details
    useEffect(() => {
        const totalCartDetailValid = cartDetails.filter(x => x.productActivate && x.quantityProductRemaining > 0).length;

        setTotalCartDetailValid(totalCartDetailValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetails])

    useEffect(() => {
        const listCartIds = [];
        for (let i = 0; i < carts.length; i++) {
            const cartDetailValid = carts[i].products.filter(x => x.quantityProductRemaining > 0 && x.productActivate);

            const isAllElementsExist = cartDetailValid.every(x => cartDetailIdSelecteds.includes(x.cartDetailId));

            if (isAllElementsExist) {
                listCartIds.push(carts[i].cartId);
            }
        }

        setCartIdSelecteds(listCartIds);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds])
    ///

    /// props
    const dataPropCouponComponent = {
        isOpenModalCoupons: isOpenModalCoupons,
        coupons: coupons,
        closeModalCoupons: closeModalCoupons,
        couponCodeSelecteds: couponCodeSelecteds,
        setCouponCodeSelecteds: setCouponCodeSelecteds,
        setCoupons: setCoupons,
        shopIdSelected: shopIdSelected,
        totalPrice: totalPrice,
        cartDetails: cartDetails,
        cartDetailIdSelecteds
    }

    ///


    // checkbox all cart
    const checkAllCart = totalCartDetailValid > 0 && cartDetailIdSelecteds.length === totalCartDetailValid;
    //


    return (
        <>
            <Col span={18} style={{ padding: 5 }}>
                <Card bodyStyle={styleCardBodyHeader} style={styleCardHeader}>
                    <Row>
                        <Col span={1}><Checkbox onChange={handleCheckAll} checked={checkAllCart}></Checkbox></Col>
                        <Col span={7} className={cx('flex-item-center')}>Sản phẩm</Col>
                        <Col span={5} className={cx('flex-item-center')}>Đơn giá</Col>
                        <Col span={4} className={cx('flex-item-center')}>Số Lượng</Col>
                        <Col span={4} className={cx('flex-item-center')}>Số Tiền</Col>
                        <Col span={3} className={cx('flex-item-center')}>Thao Tác</Col>
                    </Row>
                </Card>
                <Checkbox.Group value={cartDetailIdSelecteds} onChange={handleOnChangeCheckbox} style={{ display: 'block' }} >
                    {
                        carts.map((cart, index) => (
                            <Card
                                hoverable
                                title={
                                    <Checkbox.Group value={cartIdSelecteds}>
                                        <Space align="center" size={10}>
                                            <Checkbox value={cart.cartId} onChange={(e) => { handleOnChangeCheckboxCartItem(cart.cartId, e) }}>
                                            </Checkbox>
                                            <ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}
                                        </Space>
                                    </Checkbox.Group>}
                                key={index} bodyStyle={styleCardBodyCartItem} headStyle={styleCardHeadCartItem} style={styleCardCartItem}>
                                {
                                    cart.products.map((product, index) => (
                                        <Row className={product.productActivate === false || product.quantityProductRemaining === 0 ? cx('disable-item', 'margin-bottom-item') : cx('margin-bottom-item')} key={index}>
                                            <Col span={1}>
                                                {
                                                    product.productActivate && product.quantityProductRemaining > 0 ? <Checkbox value={product.cartDetailId}></Checkbox> : <></>
                                                }
                                            </Col>

                                            <Col span={7} className={cx('flex-item-center')}>
                                                <Space align="center" size={30}>
                                                    <div style={{ padding: 15, position: 'relative' }}>
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            src={product.productThumbnail}
                                                        />
                                                        {
                                                            product.productActivate === false ?
                                                                <div className={cx('circle')}>Sản phẩm này đã bị ẩn</div>
                                                                : product.quantityProductRemaining === 0 ? <div className={cx('circle')}>Hết hàng</div> : <></>
                                                        }
                                                    </div>

                                                    <Link to={'/product/' + product.productId} >{product.productName}</Link>
                                                    <Text type="secondary">Loại: {product.productVariantName}</Text>
                                                </Space>
                                            </Col>
                                            <Col span={5} className={cx('flex-item-center')}>
                                                <Space align="center" size={15}>
                                                    <Text type="secondary" delete>{formatPrice(product.productVariantPrice)}</Text>
                                                    <Text>{formatPrice(discountPrice(product.productVariantPrice, product.productVariantDiscount))}</Text>
                                                </Space>
                                            </Col>
                                            <Col span={4} className={cx('flex-item-center')}>
                                                <div>
                                                    <Button disabled={product.quantity === 1 ? true : false} onClick={() => handleMinusOne(product.quantity, product.cartDetailId, product.productVariantId)}>-</Button>
                                                    <NumericInput value={product.quantity} onBlur={(e) => onBlurQuantity(e, product.cartDetailId, product.productVariantId)} />
                                                    <Button disabled={product.quantity === product.productVariantQuantity ? true : false} onClick={() => handleAddOne(product.quantity, product.cartDetailId, product.productVariantId)}>+</Button>
                                                </div>
                                            </Col>
                                            <Col span={4} className={cx('flex-item-center')}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productVariantDiscount) * product.quantity)}</Text></Col>
                                            <Col span={3} className={cx('flex-item-center')}><Button style={{ pointerEvents: 'all' }} className={cx('button-delete')} icon={<DeleteOutlined />} danger onClick={() => funcDeleteCartDetail(product.cartDetailId)}>Xóa</Button></Col>
                                        </Row>
                                    ))
                                }
                                <Row>
                                    <Col offset={1}><Button type="link" onClick={() => { setShopIdSelected(cart.shopId); showCouponShop(cart.shopId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                    <Col>
                                        {
                                            getCouponCodeSelecteds(cart.shopId) && (<Tag color="gold">{getCouponCodeSelecteds(cart.shopId)}</Tag>)
                                        }
                                    </Col>
                                </Row>

                            </Card>
                        ))
                    }
                </Checkbox.Group>
            </Col>

            <ModalConfirmation />
            <Coupons dataPropCouponComponent={dataPropCouponComponent} />
            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
        </>

    )
}

export default Products