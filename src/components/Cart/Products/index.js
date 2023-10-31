import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
// import NumericInput from '../NumericInput';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import Coupons from '../Coupons'
import { formatPrice, discountPrice } from '~/utils';
import { Link } from 'react-router-dom';
import { updateCart, deleteCartDetail } from '~/api/cart';
import { getCouponPublic } from '~/api/coupon';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification, Input, Tag, Space } from 'antd';
import { CopyrightOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import {
    RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_MESSAGE_CART_INVALID_QUANTITY,
    RESPONSE_MESSAGE_CART_NOT_FOUND, RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_CART_SUCCESS, COUPON_TYPE_ALL_PRODUCTS, COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, COUPON_TYPE_SPECIFIC_PRODUCTS
} from '~/constants';

const { Text } = Typography;
const cx = classNames.bind(styles);



const Products = ({ dataPropProductComponent }) => {
    // distructuring props
    const {
        userId,
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
    } = dataPropProductComponent;
    //

    //states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    const [isOpenModalCoupons, setIsOpenModalCoupons] = useState(false);
    const [totalCartDetails, setTotalCartDetails] = useState(0);
    const [shopIdSelected, setShopIdSelected] = useState(0);
    const [cartIdSelecteds, setCartIdSelecteds] = useState([]);

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
    ///

    /// handles
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
        const value = e.target.value
        updateCart({ userId: userId, cartDetailId: cartDetailId, productVariantId: productVariantId, quantity: value })
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
        console.log('handleCheckAll');
        if (e.target.checked) {
            const listCartDetailIds = [];
            const listCartIds = [];
            for (let i = 0; i < carts.length; i++) {
                listCartIds.push(carts[i].cartId);
                const products = carts[i].products;
                if (products) {
                    const cartDetailIds = products.map(product => product.cartDetailId);
                    if (cartDetailIds) {
                        listCartDetailIds.push(cartDetailIds);
                    }
                }
            }

            setCartIdSelecteds(listCartIds);
            setCartDetailIdSelecteds([].concat(...listCartDetailIds));
        } else {
            setCartIdSelecteds([]);
            setCartDetailIdSelecteds([]);
        }
    }

    const handleOnChangeCheckboxCartItem = (cartId) => {
        // check and add cart id selectes
        const cartIdSelectedFind = cartIdSelecteds.find(x => x === cartId);
        if (!cartIdSelectedFind) {
            setCartIdSelecteds((prev) => [...prev, cartId]);
        } else {
            const newCartIdSelecteds = cartIdSelecteds.filter(x => x !== cartId);
            setCartIdSelecteds(newCartIdSelecteds);
        }

        // check and add cart detail id selectes
        const cartFind = carts.find(x => x.cartId === cartId);
        if (!cartFind) return;
        const products = cartFind.products;
        if (!products) return;
        const cartDetailIds = products.map(product => product.cartDetailId);
        if (!cartDetailIds) return;
        const cartDetailIdSelectedFil = cartDetailIdSelecteds.filter(x => cartDetailIds.includes(x));
        if (!cartDetailIdSelectedFil || cartDetailIdSelectedFil.length === 0) {
            setCartDetailIdSelecteds((prev) => [...prev, ...cartDetailIds]);
        } else {
            const newCartDetailIdSelecteds = cartDetailIdSelecteds.filter(x => !cartDetailIdSelectedFil.some(y => x === y));
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

    /// useEffect 
    // calculator number cart details
    useEffect(() => {
        const CalculatorTotalCartDetails = () => {
            const totalCartDetails = carts.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.products.length;
            }, 0);

            return totalCartDetails;
        }

        setTotalCartDetails(CalculatorTotalCartDetails())
    }, [carts])


    useEffect(() => {
        const indeterminateCheckboxAllCartItem = () => {
            const newCartIdSelecteds = [];
            for (let i = 0; i < carts.length; i++) {
                const products = carts[i].products;
                const cartDetailIdSelectedFil = cartDetailIdSelecteds.filter(x => products.some(y => y.cartDetailId === x));
                if (products.length === cartDetailIdSelectedFil.length) {
                    newCartIdSelecteds.push(carts[i].cartId)
                }
            }
            // set new Cart id selecteds
            setCartIdSelecteds(newCartIdSelecteds);
        }

        indeterminateCheckboxAllCartItem()

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
        totalPrice: totalPrice
    }

    ///


    // checkbox all cart
    const checkAllCart = cartDetailIdSelecteds.length === totalCartDetails;
    const indeterminateCheckAllCart = cartDetailIdSelecteds.length > 0 && cartDetailIdSelecteds.length < totalCartDetails;
    //


    return (
        <>
            <Col span={18} style={{ padding: 5 }}>
                <Card bodyStyle={styleCardBodyHeader} style={styleCardHeader}>
                    <Row>
                        <Col span={1}><Checkbox onChange={handleCheckAll} indeterminate={indeterminateCheckAllCart} checked={checkAllCart}></Checkbox></Col>
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
                                        <Space align="center" size={10}><Checkbox value={cart.cartId} onChange={() => { handleOnChangeCheckboxCartItem(cart.cartId) }}></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}</Space>
                                    </Checkbox.Group>}
                                key={index} bodyStyle={styleCardBodyCartItem} headStyle={styleCardHeadCartItem} style={styleCardCartItem}>
                                {
                                    cart.products.map((product, index) => (
                                        <Row className={cx('margin-bottom-item')} key={index}>
                                            <Col span={1}>
                                                <Checkbox value={product.cartDetailId}></Checkbox>
                                            </Col>

                                            <Col span={7} className={cx('flex-item-center')}>
                                                <Space align="center" size={30}>
                                                    <Image
                                                        width={80}
                                                        src={product.productThumbnail}
                                                    />
                                                    <Link to={'/product/' + product.productId} >{product.productName}</Link>
                                                    <Text type="secondary">Loại: {product.productVariantName}</Text>
                                                </Space>
                                            </Col>
                                            <Col span={5} className={cx('flex-item-center')}>
                                                <Space align="center" size={15}>
                                                    <Text type="secondary" delete>{formatPrice(product.productVariantPrice)}</Text>
                                                    <Text>{formatPrice(discountPrice(product.productVariantPrice, product.productDiscount))}</Text>
                                                </Space>
                                            </Col>
                                            <Col span={4} className={cx('flex-item-center')}>
                                                <div>
                                                    <Button disabled={product.quantity === 1 ? true : false} onClick={() => handleMinusOne(product.quantity, product.cartDetailId, product.productVariantId)}>-</Button>
                                                    <NumericInput value={product.quantity} onBlur={(e) => onBlurQuantity(e, product.cartDetailId, product.productVariantId)} />
                                                    <Button disabled={product.quantity === product.productVariantQuantity ? true : false} onClick={() => handleAddOne(product.quantity, product.cartDetailId, product.productVariantId)}>+</Button>
                                                </div>
                                            </Col>
                                            <Col span={4} className={cx('flex-item-center')}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productDiscount) * product.quantity)}</Text></Col>
                                            <Col span={3} className={cx('flex-item-center')}><Button icon={<DeleteOutlined />} danger onClick={() => funcDeleteCartDetail(product.cartDetailId)}>Xóa</Button></Col>
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

            <Coupons dataPropCouponComponent={dataPropCouponComponent} />
            <ModalAlert isOpen={isOpenModalAlert} handleOk={closeModalAlert} content={contentModalAlert} />
            <ModalConfirmation />
        </>

    )
}

export default Products