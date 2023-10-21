import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import NumericInput from '../NumericInput';
import ModalAlert from '~/components/Modals/ModalAlert';
import ModalConfirmation from '~/components/Modals/ModalConfirmation';
import Coupons from '../Coupons'
import { formatPrice } from '~/utils';
import { Link } from 'react-router-dom';
import { updateCart, deleteCart } from '~/api/cart';
import { Button, Row, Col, Image, Checkbox, Card, Typography, notification } from 'antd';
import { CopyrightOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { CART_RESPONSE_CODE_INVALID_QUANTITY } from '~/constants';

const { Text } = Typography;
const cx = classNames.bind(styles);



const Products = (props) => {
    // distructuring props
    const {
        userId,
        carts,
        itemCartSelected,
        handleCheckAll,
        handleOnChangeCheckbox,
        handleCheckAllGroup,
        checkAllGroup,
        reloadCarts,
        updateCarts
    } = props;
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
    const checkAll = itemCartSelected.length === carts.length
    const indeterminate = itemCartSelected.length > 0 && itemCartSelected.length < carts.length;
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


    return (
        <>
            <Col span={18} style={{ padding: 5 }}>
                <Card bodyStyle={{ padding: 20 }} style={{ marginBottom: 10 }}>
                    <Row style={{ height: '3vh' }}>
                        <Col><Checkbox indeterminate={indeterminate} onChange={handleCheckAll} checked={checkAll}></Checkbox></Col>
                        <Col offset={5}>Sản phẩm</Col>
                        <Col offset={7}>Đơn giá</Col>
                        <Col offset={1}>Số Lượng</Col>
                        <Col offset={2}>Số Tiền</Col>
                        <Col offset={1}>Thao Tác</Col>
                    </Row>
                </Card>
                <Checkbox.Group value={itemCartSelected.map((item) => item.productVariantId)} onChange={handleOnChangeCheckbox} style={{ display: 'block' }}>
                    {
                        carts.map((item, index) => (
                            <Card
                                hoverable
                                title={<><Checkbox value={item.shopId} onChange={handleCheckAllGroup} checked={checkAllGroup(item.shopId)}></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {item.shopName}</>}
                                key={index} bodyStyle={{ padding: 20 }} headStyle={{ paddingLeft: 20 }} style={{ marginBottom: 10 }}>
                                {
                                    item.products.map((sonItem, index) => (
                                        <Row className={cx('margin-bottom-item')} key={index}>
                                            <Col >
                                                <Checkbox value={sonItem.productVariantId}></Checkbox>
                                            </Col>

                                            <Col offset={1}>
                                                <Image
                                                    width={80}
                                                    src={sonItem.thumbnail}
                                                />
                                            </Col>
                                            <Col offset={1}><Link to={'/product/' + sonItem.productId} >{sonItem.productName}</Link></Col>
                                            <Col offset={1}><Text type="secondary">Loại: {sonItem.productVariantName}</Text></Col>
                                            <Col offset={1}><Text type="secondary" delete>{formatPrice(sonItem.price)}</Text></Col>
                                            <Col offset={1}><Text>{formatPrice(sonItem.priceDiscount)}</Text></Col>
                                            <Col offset={1}>
                                                <div>
                                                    <Button disabled={sonItem.quantity === 1 ? true : false} onClick={() => handleMinusOne(sonItem.quantity, sonItem.productVariantId)}>-</Button>

                                                    <NumericInput value={sonItem.quantity} onBlur={(e) => onBlurQuantity(e, sonItem.productVariantId)} />
                                                    <Button disabled={sonItem.quantity === sonItem.productVariantQuantity ? true : false} onClick={() => handleAddOne(sonItem.quantity, sonItem.productVariantId)}>+</Button>

                                                </div>

                                            </Col>
                                            <Col offset={1}><Text>{formatPrice(sonItem.priceDiscount * sonItem.quantity)}</Text></Col>
                                            <Col offset={1}><Button icon={<DeleteOutlined />} danger onClick={() => { setProductVariantsIdSelected(sonItem.productVariantId); showModalConfirmDelete() }}>Xóa</Button></Col>
                                        </Row>
                                    ))
                                }
                                <Row>
                                    <Col offset={1}><Button type="link" onClick={() => { showCouponShop(item.shopId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                    <Col>{
                                        item.coupons?.map((item) => (
                                            <p>{item.price}</p>
                                        ))
                                    }</Col>
                                </Row>

                            </Card>
                        ))
                    }
                </Checkbox.Group>
            </Col>

            <Coupons />
            <ModalAlert />
            <ModalConfirmation />
        </>

    )
}

export default Products