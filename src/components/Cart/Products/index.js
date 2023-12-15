import React, { useEffect, useState } from 'react';
import Coupons from '../Coupons';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import cartEmpty from '~/assets/images/cartEmpty.png'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { getCouponPublic } from '~/api/coupon';
import { formatPrice, discountPrice } from '~/utils';
import { updateCart, deleteCartDetail } from '~/api/cart';
import { CopyrightOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification, Input, Tag, Space, Result } from 'antd';
import {
    RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_INVALID_QUANTITY,
    RESPONSE_MESSAGE_CART_NOT_FOUND, RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_CART_SUCCESS, RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_SUCCESS,
    COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, COUPON_TYPE_SPECIFIC_PRODUCTS
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
        couponSelecteds,
        setCouponSelecteds,
        coupons,
        setCoupons,
        getPriceDiscountCouponSelecteds,
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
    const [cartValids, setCartValids] = useState([]);
    const [cartDetailValids, setCartDetailValids] = useState([]);
    const [shopIdSelected, setShopIdSelected] = useState(0);
    const [cartIdSelecteds, setCartIdSelecteds] = useState([]);
    const [cartItemSelecteds, setCartItemSelecteds] = useState([]); // object type { shopId, totalPrice, productIds[] }
    ///

    /// router
    const navigate = useNavigate();
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
    const handleBuyNow = () => {
        return navigate(`/home`);
    }

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
            .catch((error) => { })
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
            .catch((error) => { })
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
            .catch((error) => { })
    }

    const showCouponShop = (shopId) => {

        getCouponPublic(shopId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setCoupons(data.result);
                        openModalCoupons();
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification("error", "Cửa hàng không tồn tại");
                    } else {
                        notification("error", "Có lỗi từ hệ thống, vui lòng thử lại sau");
                    }
                }
            })
            .catch((error) => { notification("error", "Có lỗi từ hệ thống, vui lòng thử lại sau"); })
    }

    const handleCheckAll = (e) => {

        if (e.target.checked) {
            const listCartDetailIds = cartDetailValids.map(x => x.cartDetailId);

            setCartDetailIdSelecteds(listCartDetailIds);
        } else {
            setCartDetailIdSelecteds([]);
        }
    }

    const handleOnChangeCheckboxCartItem = (cartId, e) => {

        let cartDetailIds = [];
        const cartFind = cartValids.find(x => x.cartId === cartId);
        if (!cartFind) return;
        const cartDetails = cartFind.products;
        for (let i = 0; i < cartDetails.length; i++) {
            if (cartDetails[i].quantityProductRemaining > 0 && cartDetails[i].productActivate && cartDetails[i].productVariantActivate) {
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
    // get cart valid
    useEffect(() => {
        const listCartValids = [];
        const listCartDetailValids = [];
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].shopActivate) {
                // add cart valid
                listCartValids.push(carts[i]);

                const cartDetailValid = carts[i].products.filter(x => x.quantityProductRemaining > 0 && x.productActivate && x.productVariantActivate);

                if (cartDetailValid.length > 0) {
                    listCartDetailValids.push(cartDetailValid);
                }
            }
        }

        setCartValids(listCartValids);
        setCartDetailValids([].concat(...listCartDetailValids));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carts])

    useEffect(() => {
        const listCartIds = [];
        for (let i = 0; i < carts.length; i++) {
            const cartDetailValid = carts[i].products.filter(x => x.quantityProductRemaining > 0 && x.productActivate && x.productVariantActivate);

            const isAllElementsExist = cartDetailValid.every(x => cartDetailIdSelecteds.includes(x.cartDetailId));

            if (isAllElementsExist) {
                listCartIds.push(carts[i].cartId);
            }
        }
        setCartIdSelecteds(listCartIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds])

    useEffect(() => {

        if (cartDetailIdSelecteds.length > 0) {
            const cartItemSelecteds = [];
            for (let i = 0; i < carts.length; i++) {
                const products = carts[i].products;
                if (products) {
                    const productFil = products.filter(x => cartDetailIdSelecteds.some(y => x.cartDetailId === y));
                    if (productFil.length > 0) {
                        // calculator price
                        let totalDiscountPrice = productFil.reduce((accumulator, currentValue) => {
                            return accumulator + (discountPrice(currentValue.productVariantPrice, currentValue.productVariantDiscount) * currentValue.quantity);
                        }, 0);

                        let totalPrice = totalDiscountPrice > 0 ? totalDiscountPrice : 0;
                        // mapper products id
                        const productIds = productFil.map(x => x.productId);
                        const uniqueProductIds = [...new Set(productIds)];

                        // cart item selected
                        const newCartItemSelected = { shopId: carts[i].shopId, totalPrice, productIds: uniqueProductIds };

                        // add to list
                        cartItemSelecteds.push(newCartItemSelected);
                    }
                }
            }

            // update state
            setCartItemSelecteds(cartItemSelecteds);
        } else if (cartDetailIdSelecteds.length === 0) {
            // update state
            setCartItemSelecteds([]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds, carts]);

    // check coupons selecteds
    useEffect(() => {
        if (couponSelecteds.length > 0) {
            const newCouponSelecteds = [];
            for (let i = 0; i < couponSelecteds.length; i++) {
                const cartItemSelectedFind = cartItemSelecteds.find(x => x.shopId === couponSelecteds[i].shopId);
                if (cartItemSelectedFind) {
                    const totalPrice = cartItemSelectedFind.totalPrice;
                    const productIds = cartItemSelectedFind.productIds;

                    // check if the product is valid with the coupon 
                    if (couponSelecteds[i].couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS) {
                        // check productId exists
                        const isProductIdExists = couponSelecteds[i].productIds.some(x => productIds.includes(x));
                        if (totalPrice >= couponSelecteds[i].minTotalOrderValue && isProductIdExists) {
                            newCouponSelecteds.push(couponSelecteds[i]);
                        }
                    } else if (couponSelecteds[i].couponTypeId === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP) {
                        if (totalPrice >= couponSelecteds[i].minTotalOrderValue) {
                            newCouponSelecteds.push(couponSelecteds[i]);
                        }
                    }
                }
            }

            // update coupon selecteds
            setCouponSelecteds(newCouponSelecteds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItemSelecteds])
    ///

    /// props
    const dataPropCouponComponent = {
        isOpenModalCoupons: isOpenModalCoupons,
        coupons: coupons,
        closeModalCoupons: closeModalCoupons,
        couponSelecteds: couponSelecteds,
        setCouponSelecteds: setCouponSelecteds,
        setCoupons: setCoupons,
        shopIdSelected: shopIdSelected,
        cartDetails: cartDetails,
        cartDetailIdSelecteds,
        cartItemSelecteds: cartItemSelecteds
    }
    ///

    /// functions
    const funcDeleteCartDetail = (cartDetailId) => {

        deleteCartDetail(cartDetailId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        setContentModalAlert(RESPONSE_MESSAGE_CART_NOT_FOUND)
                        openModalAlert();
                    } else if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS) {

                        // new cart detail id selected
                        const newCartDetailIdSelecteds = cartDetailIdSelecteds.filter(x => x !== cartDetailId);
                        setCartDetailIdSelecteds(newCartDetailIdSelecteds);

                        reloadCarts();
                    }
                }
            })
            .catch((errors) => { })
    };


    // checkbox all cart
    const checkAllCart = cartDetailValids.length > 0 && cartDetailIdSelecteds.length === cartDetailValids.length;
    //

    return (
        <>
            <Col span={18} style={{ padding: 5 }}>
                {
                    carts.length > 0 ? (<>
                        <Card bodyStyle={styleCardBodyHeader} style={styleCardHeader}>
                            <Row>
                                <Col span={1}><Checkbox onChange={handleCheckAll} checked={checkAllCart}></Checkbox></Col>
                                <Col span={6} className={cx('flex-item-center')}>Sản phẩm</Col>
                                <Col span={3} className={cx('flex-item-center')}>Loại</Col>
                                <Col span={4} className={cx('flex-item-center')}>Đơn giá</Col>
                                <Col span={5} className={cx('flex-item-center')}>Số Lượng</Col>
                                <Col span={3} className={cx('flex-item-center')}>Số Tiền</Col>
                                <Col span={2} className={cx('flex-item-center')}>Thao tác</Col>
                            </Row>
                        </Card>
                        <Checkbox.Group value={cartDetailIdSelecteds} onChange={handleOnChangeCheckbox} style={{ display: 'block' }} >
                            {
                                carts.map((cart, index) => (
                                    <Card
                                        className={!cart.shopActivate ? cx('disable-item') : {}}
                                        hoverable
                                        title={
                                            <Checkbox.Group value={cartIdSelecteds}>
                                                <Space align="center" size={10}>
                                                    {
                                                        cart.shopActivate ? <Checkbox key={cart.cartId} value={cart.cartId} onChange={(e) => { handleOnChangeCheckboxCartItem(cart.cartId, e) }} /> : <></>
                                                    }
                                                    <Link to={`/shop/${cart.shopId}`}><Space align='center'><ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}</Space></Link>
                                                </Space>
                                            </Checkbox.Group>}
                                        key={index} bodyStyle={styleCardBodyCartItem} headStyle={styleCardHeadCartItem} style={styleCardCartItem}>
                                        {
                                            cart.products.map((product, index) => (
                                                <Row className={product.productVariantActivate === false || product.productActivate === false || product.quantityProductRemaining === 0 ? cx('disable-item', 'margin-bottom-item') : cx('margin-bottom-item')} key={index}>
                                                    <Col span={1} className={cx('flex-item-center')}>
                                                        {
                                                            cart.shopActivate && product.productVariantActivate && product.productActivate && product.quantityProductRemaining > 0 ? <Checkbox key={product.cartDetailId} value={product.cartDetailId}></Checkbox> : <></>
                                                        }
                                                    </Col>

                                                    <Col span={6} className={cx('flex-item-center')}>
                                                        <Space align="center" size={30}>
                                                            <div style={{ padding: 15, position: 'relative' }}>
                                                                <Image
                                                                    width={100}
                                                                    height={100}
                                                                    src={product.productThumbnail}
                                                                />
                                                                {
                                                                    !cart.shopActivate || !product.productActivate || !product.productVariantActivate ?
                                                                        <div className={cx('circle')}>Đã ẩn</div>
                                                                        : product.quantityProductRemaining === 0 ? <div className={cx('circle')}>Hết hàng</div> : <></>
                                                                }
                                                            </div>
                                                            <Link to={'/product/' + product.productId} >{product.productName}</Link>
                                                        </Space>
                                                    </Col>
                                                    <Col span={3} className={cx('flex-item-center')}>
                                                        <Text type="secondary">{product.productVariantName}</Text>
                                                    </Col>
                                                    <Col span={4} className={cx('flex-item-center')}>
                                                        <Space align="center" size={15}>
                                                            <Text type="secondary" delete>{formatPrice(product.productVariantPrice)}</Text>
                                                            <Text>{formatPrice(discountPrice(product.productVariantPrice, product.productVariantDiscount))}</Text>
                                                        </Space>
                                                    </Col>
                                                    <Col span={5} className={cx('flex-item-center')}>
                                                        <div>
                                                            <Button disabled={product.quantity === 1 ? true : false} onClick={() => handleMinusOne(product.quantity, product.cartDetailId, product.productVariantId)}>-</Button>
                                                            <NumericInput value={product.quantity} onBlur={(e) => onBlurQuantity(e, product.cartDetailId, product.productVariantId)} />
                                                            <Button disabled={product.quantity === product.productVariantQuantity ? true : false} onClick={() => handleAddOne(product.quantity, product.cartDetailId, product.productVariantId)}>+</Button>
                                                        </div>
                                                    </Col>
                                                    <Col span={3} className={cx('flex-item-center')}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productVariantDiscount) * product.quantity)}</Text></Col>
                                                    <Col span={2} className={cx('flex-item-center')}><Button style={{ pointerEvents: 'all' }} className={cx('button-delete')} type='link' danger onClick={() => funcDeleteCartDetail(product.cartDetailId)}>Xóa</Button></Col>
                                                </Row>
                                            ))
                                        }
                                        <Row>
                                            <Col offset={1}><Button type="link" onClick={() => { setShopIdSelected(cart.shopId); showCouponShop(cart.shopId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                            <Col>
                                                {
                                                    getPriceDiscountCouponSelecteds(cart.shopId) !== 0 && <Tag color="gold">Giảm {formatPrice(getPriceDiscountCouponSelecteds(cart.shopId))} từ mã giảm giá</Tag>
                                                }
                                            </Col>
                                        </Row>

                                    </Card>
                                ))
                            }
                        </Checkbox.Group>
                    </>


                    ) : (<Result
                        title="Giỏ hàng trống!"
                        icon={<img alt='cart empty' src={cartEmpty} />}
                        extra={
                            <Button type="primary" key="console" onClick={handleBuyNow}>
                                Mua ngay
                            </Button>
                        }
                    />)
                }

            </Col>

            <ModalConfirmation />
            <Coupons dataPropCouponComponent={dataPropCouponComponent} />
            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
        </>

    )
}

export default Products