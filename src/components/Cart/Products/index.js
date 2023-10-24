import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/Cart/Cart.module.scss';
import NumericInput from '../NumericInput';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import Coupons from '../Coupons'
import { formatPrice, discountPrice } from '~/utils';
import { Link } from 'react-router-dom';
import { updateCart, deleteCart } from '~/api/cart';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification } from 'antd';
import { CopyrightOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { CART_RESPONSE_CODE_INVALID_QUANTITY } from '~/constants';

const { Text } = Typography;
const cx = classNames.bind(styles);



const Products = ({ dataPropProductComponent }) => {
    // distructuring props
    const {
        userId,
        carts,
        setCartDetailIdSelecteds,

        handleCheckAll,
        handleOnChangeCheckbox,
        handleCheckAllGroup,
        checkAllGroup,
        reloadCarts,
        updateCarts
    } = dataPropProductComponent;
    //

    //states
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [contentModalAlert, setContentModalAlert] = useState('');
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);
    const [coupons, setCoupons] = useState([]);
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
    const showModalConfirmDelete = () => {
        setIsOpenModalDelete(true);
    };
    //


    // checkbox all
    // const checkAll = itemCartSelected.length === carts.length
    // const indeterminate = itemCartSelected.length > 0 && itemCartSelected.length < carts.length;
    //


    // handles
    const handleMinusOne = (quantity, productVariantId) => {
        updateCart({ userId: userId, productVariantId: productVariantId, quantity: (quantity - 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModalAlert(data.message)
                        openModalAlert();
                    }
                    reloadCarts();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleAddOne = (quantity, productVariantId) => {
        updateCart({ userId: userId, productVariantId: productVariantId, quantity: (quantity + 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModalAlert(data.message)
                        openModalAlert();
                    }
                    reloadCarts();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const onBlurQuantity = (e, productVariantId) => {
        const value = e.target.value
        updateCart({ userId: userId, productVariantId: productVariantId, quantity: value })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModalAlert(data.message)
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

        // const productVariantFind = itemCartSelected.find(c => c.productVariantId === productVariantId)
        // if (!productVariantFind) {
        //     openNotification("error", "Vui lòng chọn sản phẩm để thêm mã giảm giá của Shop")
        //     return;
        // }
        // const existCoupons = itemCartSelected.find(c => c.productVariantId === productVariantId)?.coupons
        // if (existCoupons) {
        //     setChooseCoupons([...existCoupons])\
        // }
        // setIsModalChooseCoupon(true)
    }

    const handleAcceptDelete = () => {
        setIsOpenModalDelete(false);
        const findCart = carts.find(c => c.productVariantId === productVariantsIdSelected)
        const newCarts = carts.filter(c => c.productVariantId !== findCart.productVariantId)

        const dataDelete = {
            userId: findCart.userId,
            productVariantId: findCart.productVariantId
        }

        deleteCart(dataDelete)
            .then((res) => {
                if (res.data.ok === true) {
                    updateCarts(newCarts)
                    setProductVariantsIdSelected(0)
                } else {
                    notification("error", "Lỗi", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
                }
            })
            .catch((errors) => {
                console.log(errors)
                notification("error", "Lỗi", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
            })
    };
    //

    /// styles
    const styleCardHeader = { marginBottom: 10 }
    const styleCardBodyHeader = { padding: 20 }

    const styleCardCartItem = { marginBottom: 10 }
    const styleCardHeadCartItem = { paddingLeft: 20 }
    const styleCardBodyCartItem = { padding: 20 }
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
                {/* <Checkbox.Group value={itemCartSelected.map((item) => item.productVariantId)} onChange={handleOnChangeCheckbox} style={{ display: 'block' }}> */}
                {
                    carts.map((cart, index) => (
                        <Card
                            hoverable
                            // title={<><Checkbox value={cart.cartId} onChange={handleCheckAllGroup} checked={checkAllGroup(cart.shopId)}></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}</>}
                            title={<><Checkbox value={cart.cartId} onChange={handleCheckAllGroup} ></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {cart.shopName}</>}
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
                                                <Button disabled={product.quantity === 1 ? true : false} onClick={() => handleMinusOne(product.quantity, product.productVariantId)}>-</Button>

                                                <NumericInput value={product.quantity} onBlur={(e) => onBlurQuantity(e, product.productVariantId)} />
                                                <Button disabled={product.quantity === product.productVariantQuantity ? true : false} onClick={() => handleAddOne(product.quantity, product.productVariantId)}>+</Button>

                                            </div>

                                        </Col>
                                        <Col offset={1}><Text>{formatPrice(discountPrice(product.productVariantPrice, product.productDiscount) * product.quantity)}</Text></Col>
                                        <Col offset={1}><Button icon={<DeleteOutlined />} danger onClick={() => { setProductVariantsIdSelected(product.productVariantId); showModalConfirmDelete() }}>Xóa</Button></Col>
                                    </Row>
                                ))
                            }
                            <Row>
                                <Col offset={1}><Button type="link" onClick={() => { showCouponShop(cart.shopId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                <Col>{
                                    // cart.coupons?.map((item) => (
                                    //     <p>{item.price}</p>
                                    // ))
                                }</Col>
                            </Row>

                        </Card>
                    ))
                }
                {/* </Checkbox.Group> */}
            </Col>

            <Coupons />
            <ModalAlert />
            <ModalConfirmation />
        </>

    )
}

export default Products