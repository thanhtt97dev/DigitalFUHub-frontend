import moment from 'moment';
import { addOrder } from '~/api/order';
import styles from './Cart.module.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { getCoupons } from '~/api/coupon';
import Spinning from "~/components/Spinning";
import { useAuthUser } from 'react-auth-kit';
import { getCustomerBalance } from '~/api/user';
import React, { useEffect, useState } from 'react';
import { getCartsByUserId, deleteCart, updateCart } from '~/api/cart';
import { formatPrice, getUserId, getVietnamCurrentTime } from '~/utils';
import { CopyrightOutlined, DeleteOutlined, PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Row, Col, Image, Typography, Modal, notification, Checkbox, Divider, List, Input, Card } from 'antd';
import {
    CART_RESPONSE_CODE_INVALID_QUANTITY, CART_RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, CART_RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_ORDER_COUPON_USED, RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY, RESPONSE_CODE_SUCCESS,
    RESPONSE_MESSAGE_ORDER_COUPON_USED, RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE, RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY
} from '~/constants';

const { Search } = Input;
const { Title, Text } = Typography;
const cx = classNames.bind(styles);

const ModelNotify = ({ isModelState, setIsModelState, content }) => (
    <Modal
        open={isModelState}
        closable={false}
        maskClosable={false}
        footer={[
            <Button key="submit" type="primary" onClick={() => { setIsModelState(false); }}>
                OK
            </Button>,
        ]}
    >
        <p>{content}</p>
    </Modal>
)


const Cart = () => {
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const initialTotalPrice = {
        originPrice: 0,
        discountPrice: 0,
        subProductDiscount: 0,
        subCouponDiscount: 0
    }
    const [carts, setCarts] = useState([])
    const [isLoadCart, setIsLoadCart] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [balance, setBalance] = useState(0);
    const [inputCouponCode, setInputCouponCode] = useState('')
    const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
    const [isModalNotifyBalance, setIsModalNotifyBalance] = useState(false);
    const [isModalConfirmBuy, setIsModalConfirmBuy] = useState(false);
    const [isModalChooseCoupon, setIsModalChooseCoupon] = useState(false);
    const [isModelInvalidCartProductQuantity, setIsModelInvalidCartProductQuantity] = useState(false)
    const [isModelInvalidCartQuantity, setIsModelInvalidCartQuantity] = useState(false)
    const [contentModel, setContentModel] = useState('');
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);
    const [itemCartSelected, setItemCartSelected] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [chooseCoupons, setChooseCoupons] = useState([]);
    const [isCouponInfoSuccess, setIsCouponInfoSuccess] = useState(false);
    const [isModelNotify, setIsModelNotify] = useState(false);
    const [IsUseCoin, setIsUseCoin] = useState(false);
    const [userCoin, setUserCoin] = useState(0);

    const checkAll = itemCartSelected.length === carts.length
    const indeterminate = itemCartSelected.length > 0 && itemCartSelected.length < carts.length;

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const loadDataCart = () => {
        setIsLoadCart(!isLoadCart)
    }

    const addCoupon = (coupon) => {
        const chooseCouponsFind = chooseCoupons.find(c => c.couponId === coupon.couponId)
        if (!chooseCouponsFind) {
            setChooseCoupons((prev) => [...prev, coupon])
        }
    }

    const deleteCoupon = (coupon) => {
        const chooseCouponsFind = chooseCoupons.find(c => c.couponId === coupon.couponId)
        if (chooseCouponsFind) {
            const newChooseCoupons = chooseCoupons.filter(c => c.couponId !== coupon.couponId)
            setChooseCoupons([...newChooseCoupons])
        }

    }


    const updateCarts = (cart) => {
        setCarts(cart);
    }

    const getCouponShop = (productVariantId) => {
        const productVariantFind = itemCartSelected.find(c => c.productVariantId === productVariantId)
        if (!productVariantFind) {
            openNotification("error", "Vui lòng chọn sản phẩm để thêm mã giảm giá của Shop")
            return;
        }
        const existCoupons = itemCartSelected.find(c => c.productVariantId === productVariantId)?.coupons
        if (existCoupons) {
            setChooseCoupons([...existCoupons])
        }
        setIsModalChooseCoupon(true)
    }


    const showModalConfirmDelete = () => {
        setIsModalConfirmDelete(true);
    };

    const showModalNotifyBalance = () => {
        setIsModalNotifyBalance(true);
    };

    const showModalConfirmBuy = () => {
        setIsModalConfirmBuy(true);
    };

    const handleAcceptDelete = () => {
        setIsModalConfirmDelete(false);
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
                    //openNotification("success", "Xóa sản phẩm thành công")
                    setProductVariantsIdSelected(0)
                } else {
                    openNotification("error", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
                }
            })
            .catch((errors) => {
                console.log(errors)
                openNotification("error", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
            })
    };

    const handleOkChooseCoupon = () => {
        const newCarts = carts.map((cart) => {
            if (cart.productVariantId === productVariantsIdSelected) {
                return { ...cart, coupons: [...chooseCoupons] }
            }

            return cart
        })
        setCarts([...newCarts])

        const newCartsSelected = itemCartSelected.map((cart) => {
            if (cart.productVariantId === productVariantsIdSelected) {
                return { ...cart, coupons: [...chooseCoupons] }
            }

            return cart
        })
        setItemCartSelected([...newCartsSelected])
        setChooseCoupons([])
        setIsModalChooseCoupon(false);
    }

    const handleOkConfirmBuy = () => {
        const lstDataOrder = itemCartSelected.map((c) => ({
            productVariantId: c.productVariantId,
            quantity: c.quantity,
            coupons: c.coupons.map((coupon) => coupon.couponCode)
        }));

        const finalDataOrder = {
            userId: getUserId(),
            Products: lstDataOrder,
            IsUseCoin: IsUseCoin

        }
        addOrder(finalDataOrder)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    console.log('data: ' + JSON.stringify(data))
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        openNotification("success", "Thanh toán đơn hàng thành công")
                        itemCartSelected.map(item => {
                            return deleteCart({ userId: item.userId, productVariantId: item.productVariantId })
                                .then((res) => {
                                    if (res.status === 200) {
                                        setItemCartSelected([])
                                        loadDataCart();
                                    }
                                })
                                .catch((errors) => {
                                    console.log(errors)
                                });
                        })
                    } else {
                        if (data.status.responseCode === RESPONSE_CODE_ORDER_COUPON_USED) {
                            setContentModel(RESPONSE_MESSAGE_ORDER_COUPON_USED)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_INSUFFICIENT_BALANCE) {
                            setContentModel(RESPONSE_MESSAGE_ORDER_INSUFFICIENT_BALANCE)
                        } else if (data.status.responseCode === RESPONSE_CODE_ORDER_NOT_ENOUGH_QUANTITY) {
                            setContentModel(RESPONSE_MESSAGE_ORDER_NOT_ENOUGH_QUANTITY)
                        }
                        setIsModelNotify(true);
                    }
                    setIsModalConfirmBuy(false);
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    const handleCancelChooseCoupon = () => {
        setIsModalChooseCoupon(false);
    };

    const handleCancelConfirmBuy = () => {
        setIsModalConfirmBuy(false);
    };


    const handleCancelConfirmDelete = () => {
        setProductVariantsIdSelected(0)
        setIsModalConfirmDelete(false);
    };



    const handleOnChangeCheckbox = (values) => {
        if (values.length === 0) {
            setItemCartSelected([])
            return;
        }

        const cartFilter = carts.filter(c => values.includes(c.productVariantId))
        cartFilter.map((item) => {
            return updateCart({ userId: getUserId(), productVariantId: item.productVariantId, quantity: 0 })
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data
                        if (data.responseCode === CART_RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
                            setContentModel(data.message)
                            setIsModelInvalidCartProductQuantity(true)
                        } else if (data.responseCode === CART_RESPONSE_CODE_SUCCESS) {

                            setItemCartSelected([...cartFilter])
                        }
                        loadDataCart()
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    const findCartItems = (values) => {
        const cartItem = carts.map((cart) => {
            const { products } = cart;
            const productItem = products.filter(p => values.includes(p.productVariantId))
            return productItem;
        })
        return [].concat(...cartItem);
    }



    const handleOnChangeCheckboxGroup = (values) => {
        if (values.length === 0) {
            setItemCartSelected([])
            return;
        }
        const cartItems = findCartItems(values)
        setItemCartSelected([...itemCartSelected, ...cartItems])

        // cartFilter.map((item) => {
        //     return updateCart({ userId: getUserId(), productVariantId: item.productVariantId, quantity: 0 })
        //         .then((res) => {
        //             if (res.status === 200) {
        //                 const data = res.data
        //                 if (data.responseCode === CART_RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY) {
        //                     setContentModel(data.message)
        //                     setIsModelInvalidCartProductQuantity(true)
        //                 } else if (data.responseCode === CART_RESPONSE_CODE_SUCCESS) {

        //                     setItemCartSelected([...cartFilter])
        //                 }
        //                 loadDataCart()
        //             }
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        // })
    }




    const handleBuy = () => {
        if (balance < totalPrice.discountPrice) {
            setContentModel('Số dư không đủ, vui lòng nạp thêm tiền vào tài khoản')
            showModalNotifyBalance()
            return;
        }
        showModalConfirmBuy()
    }


    useEffect(() => {
        getCartsByUserId(userId)
            .then((res) => {
                const data = res.data;
                setCarts(data)
                setUserCoin(data[0].coin)
                // const { products } = data



                // if (itemCartSelected) {
                //     const newCartsSelected = products.filter(x => itemCartSelected.some(c => c.productVariant.productVariantId === x.productVariant.productVariantId));
                //     setItemCartSelected(newCartsSelected)
                // }
                console.log('data cart = ' + data)
            })
            .catch((errors) => {
                console.log(errors)
            })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadCart])

    useEffect(() => {
        getCustomerBalance(userId)
            .then((res) => {
                if (balance !== res.data) {
                    setBalance(res.data)
                }
            }).catch((err) => {
                console.log(err.message)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        const calculatorPrice = (values) => {
            if (values.length > 0) {
                const totalOriginPrice = values.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.price * currentValue.quantity);
                }, 0);


                const totalDiscountPrice = values.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.priceDiscount * currentValue.quantity);
                }, 0);


                // const finalOriginPrice = values.reduce((newOriginPrice, { coupons }) => {
                //     coupons.map((c) => {
                //         return newOriginPrice -= c.priceDiscount
                //     })
                //     return newOriginPrice
                // }, totalOriginPrice)

                // const finalDiscountPrice = values.reduce((newDiscountPrice, { coupons }) => {
                //     coupons.map((c) => {
                //         return newDiscountPrice -= c.priceDiscount
                //     })

                //     return newDiscountPrice
                // }, totalDiscountPrice)

                setTotalPrice({ originPrice: totalOriginPrice, discountPrice: totalDiscountPrice });
            } else {
                setTotalPrice({ originPrice: 0, discountPrice: 0 });
            }


        }
        calculatorPrice(itemCartSelected)

    }, [itemCartSelected])

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setItemCartSelected(carts);
        } else {
            setItemCartSelected([]);
        }
    }

    const handleCheckAllGroup = (e) => {
        const { value, checked } = e.target
        const itemCarts = carts.find(x => x.shopId === value).products;
        const itemCartSelectedFilter = itemCartSelected.filter(x => !itemCarts.includes(x))
        if (checked) {
            setItemCartSelected([...itemCartSelectedFilter, ...itemCarts]);
        } else {
            setItemCartSelected([...itemCartSelectedFilter]);
        }
    }

    const onSearch = () => {
        if (!inputCouponCode) {
            openNotification("error", "Vui lòng nhập Code để tìm kiếm mã giảm giá")
            return;
        }
        setIsCouponInfoSuccess(true)
        const cartFind = itemCartSelected.find(c => c.productVariantId === productVariantsIdSelected)
        getCoupons(cartFind.shopId, inputCouponCode)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setCoupons(data);
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setTimeout(() => {
                    setIsCouponInfoSuccess(false)
                }, 500)
            })
    }

    const handleChangeInputCode = (e) => {
        setInputCouponCode(e.target.value)
    }

    const onBlurQuantity = (e, productVariantId) => {
        const value = e.target.value
        updateCart({ userId: getUserId(), productVariantId: productVariantId, quantity: value })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModel(data.message)
                        setIsModelInvalidCartQuantity(true)
                    }
                    loadDataCart()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleMinusOne = (quantity, productVariantId) => {
        updateCart({ userId: getUserId(), productVariantId: productVariantId, quantity: (quantity - 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModel(data.message)
                        setIsModelInvalidCartQuantity(true)
                    }
                    loadDataCart()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleAddOne = (quantity, productVariantId) => {
        updateCart({ userId: getUserId(), productVariantId: productVariantId, quantity: (quantity + 1) })
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY) {
                        setContentModel(data.message)
                        setIsModelInvalidCartQuantity(true)
                    }
                    loadDataCart()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleChangeCoin = (e) => {
        setIsUseCoin(e.target.checked);
    }



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

    const checkAllGroup = (shopId) => {
        const itemCarts = carts.find(x => x.shopId === shopId).products;
        const itemCartSelectedFilter = itemCartSelected.filter(x => itemCarts.some(y => x === y))
        if (itemCarts.length === itemCartSelectedFilter.length) {
            return true;
        } else {
            return false
        }
    }

    return (
        <>
            {contextHolder}
            {carts.length > 0 ? (<>
                <Row>
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
                        {/* <Checkbox.Group value={itemCartSelected.map(item => item.productVariantId)} onChange={handleOnChangeCheckbox} style={{ display: 'block' }}> */}
                        {/* <Checkbox.Group onChange={handleOnChangeCheckbox} style={{ display: 'block' }}> */}
                        {
                            carts.map((item, index) => (
                                <Card hoverable title={(<Link to={''} >
                                    <Checkbox value={item.shopId} onChange={handleCheckAllGroup} checked={checkAllGroup(item.shopId)}></Checkbox><ShopOutlined className={cx('margin-left-40')} /> {item.shopName}</Link>)}
                                    key={index} bodyStyle={{ padding: 20 }} headStyle={{ paddingLeft: 20 }} style={{ marginBottom: 10 }}>
                                    <Checkbox.Group value={itemCartSelected.map((item) => item.productVariantId)} onChange={handleOnChangeCheckboxGroup} style={{ display: 'block' }}>
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
                                    </Checkbox.Group>




                                    <Row>
                                        <Col offset={1}><Button type="link" onClick={() => { setProductVariantsIdSelected(item.productVariantId); getCouponShop(item.productVariantId) }}><CopyrightOutlined />Thêm mã giảm giá của Shop</Button></Col>
                                        <Col>{
                                            item.coupons?.map((item) => (
                                                <p>{item.price}</p>
                                            ))
                                        }</Col>
                                    </Row>

                                </Card>
                            ))
                        }
                        {/* </Checkbox.Group> */}
                    </Col>
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
                                <Checkbox disabled={userCoin !== 0 && totalPrice.originPrice > 0 ? false : true} onChange={handleChangeCoin}></Checkbox>
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
                </Row>
                <Modal title="Thông báo" open={isModalConfirmDelete} onOk={handleAcceptDelete} onCancel={handleCancelConfirmDelete}>
                    <p>Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
                </Modal>

                <Modal title="Thông báo" open={isModalConfirmBuy} onOk={handleOkConfirmBuy} onCancel={handleCancelConfirmBuy}>
                    <p>Bạn có muốn thanh toán đơn hàng này với giá <strong>{formatPrice(totalPrice.discountPrice)}</strong> không?</p>
                </Modal>

                <ModelNotify isModelState={isModelInvalidCartProductQuantity}
                    setIsModelState={setIsModelInvalidCartProductQuantity}
                    content={contentModel}
                />

                <ModelNotify isModelState={isModelInvalidCartQuantity}
                    setIsModelState={setIsModelInvalidCartQuantity}
                    content={contentModel}
                />

                <ModelNotify isModelState={isModalNotifyBalance}
                    setIsModelState={setIsModalNotifyBalance}
                    content={contentModel}
                />


                <ModelNotify isModelState={isModelNotify}
                    setIsModelState={setIsModelNotify}
                    content={contentModel}
                />

                <Modal
                    title="Mã giảm giá của Shop"
                    open={isModalChooseCoupon}
                    onOk={handleOkChooseCoupon}
                    onCancel={handleCancelChooseCoupon}
                >
                    <Spinning spinning={isCouponInfoSuccess}>
                        <Search
                            placeholder="Nhập mã Code"
                            allowClear
                            enterButton="Tìm kiếm"
                            size="large"
                            onSearch={onSearch}
                            value={inputCouponCode}
                            onChange={handleChangeInputCode}
                            className={cx('margin-bottom-item')}
                        />
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 400,
                                overflow: 'auto',
                                padding: '0 16px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <List
                                dataSource={coupons}
                                renderItem={(item) => (
                                    <List.Item key={item.email}>
                                        <List.Item.Meta
                                            title={<a href="https://ant.design">{item.couponName}</a>}
                                            description={(<><p>Giảm {formatPrice(item.priceDiscount)} -
                                                {moment(item.endDate).diff(moment(getVietnamCurrentTime()), 'days') <= 2 ?
                                                    (<Text type="danger"> HSD: {moment(item.endDate).format('DD.MM.YYYY')} (Sắp hết hạn)</Text>)
                                                    : (<> HSD: {moment(item.endDate).format('DD.MM.YYYY')}</>)}</p></>)}
                                        />
                                        <div>
                                            {
                                                item.quantity > 0 ? (
                                                    chooseCoupons.find(c => c.couponId === item.couponId) ? (<Button icon={<DeleteOutlined />} onClick={() => { deleteCoupon(item) }} type="primary" danger>
                                                        Xóa
                                                    </Button>) : (<Button icon={<PlusOutlined />} type="primary" onClick={() => addCoupon(item)}>Sử dụng</Button>)
                                                ) : (
                                                    <Button disabled={true}>Đã hết</Button>
                                                )

                                            }
                                        </div>
                                    </List.Item>
                                )}
                            />

                        </div>


                    </Spinning>
                </Modal>
            </>) : (<Title style={{ textAlign: 'center' }} level={4}>Không có sản phẩm nào trong giỏ hàng</Title>)
            }
        </>
    )
}

export default Cart

