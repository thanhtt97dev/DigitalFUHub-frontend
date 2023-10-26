import React, { useEffect, useState } from 'react';
import Products from '~/components/Cart/Products';
import Prices from '~/components/Cart/Prices';
import Spinning from "~/components/Spinning";
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Typography } from 'antd';
import { useAuthUser } from 'react-auth-kit';
import { getCustomerBalance, getCoinUser } from '~/api/user';
import { getCartsByUserId } from '~/api/cart';
import { Row } from 'antd';
import { discountPrice } from '~/utils';
import { RESPONSE_CODE_SUCCESS } from '~/constants';


const Cart = () => {
    const { Title } = Typography;
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const cx = classNames.bind(styles);

    const initialTotalPrice = {
        originPrice: 0,
        discountPrice: 0,
        totalPriceProductDiscount: 0,
        totalPriceCouponDiscount: 0,
        totalPriceCoinDiscount: 0
    }

    const [carts, setCarts] = useState([])
    const [reloadCartsFlag, setReloadCartsFlag] = useState(false)
    const [cartDetailIdSelecteds, setCartDetailIdSelecteds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [userCoin, setUserCoin] = useState(0);
    const [isUseCoin, setIsUseCoin] = useState(false);
    const [balance, setBalance] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [couponCodeSelecteds, setCouponCodeSelecteds] = useState([]);
    const [isLoadingCartInfo, setIsLoadingCartInfo] = useState(false)




    /// handles

    const loadingCartInfo = () => {
        setIsLoadingCartInfo(true);
    }

    const unLoadingCartInfo = () => {
        setIsLoadingCartInfo(false);
    }

    const getCouponCodeSelecteds = (shopId) => {
        if (!couponCodeSelecteds) return;
        let couponCode = '';
        const coupon = couponCodeSelecteds.find(x => x.shopId === shopId);
        if (coupon) {
            couponCode = coupon.couponCode;
        }
        return couponCode;
    }

    const handleOnChangeCheckbox = (values) => {
        if (values.length === 0) {
            setCartDetailIdSelecteds([])
            return;
        }

        setCartDetailIdSelecteds([...values]);
    }


    const handleOnChangeCheckboxGroup = (values) => {
        if (values.length === 0) {
            setCartDetailIdSelecteds([])
            return;
        }
        const cartItems = findCartItems(values)
        setCartDetailIdSelecteds([...cartDetailIdSelecteds, ...cartItems])

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

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setCartDetailIdSelecteds(carts);
        } else {
            setCartDetailIdSelecteds([]);
        }
    }

    const handleCheckAllGroup = (e) => {
        const { value, checked } = e.target
        const itemCarts = carts.find(x => x.shopId === value).products;
        const itemCartSelectedFilter = cartDetailIdSelecteds.filter(x => !itemCarts.includes(x))
        if (checked) {
            setCartDetailIdSelecteds([...itemCartSelectedFilter, ...itemCarts]);
        } else {
            setCartDetailIdSelecteds([...itemCartSelectedFilter]);
        }
    }

    const checkAllGroup = (shopId) => {
        const itemCarts = carts.find(x => x.shopId === shopId).products;
        const itemCartSelectedFilter = cartDetailIdSelecteds.filter(x => itemCarts.some(y => x === y))
        if (itemCarts.length === itemCartSelectedFilter.length) {
            return true;
        } else {
            return false
        }
    }
    ///


    /// useEffects

    useEffect(() => {
        getCartsByUserId(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    setCarts(data);
                }
            })
            .catch((errors) => {
                console.log(errors)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCartsFlag])


    useEffect(() => {
        getCustomerBalance(userId)
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

    useEffect(() => {
        getCoinUser(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        if (userCoin !== data.result.coin) {
                            setUserCoin(data.result.coin);
                        }
                    }
                }
            }).catch((err) => {
                console.log(err.message)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {

        const calculatorPrice = (cartDetailIdSelecteds) => {
            let newTotalPrice = {
                originPrice: 0,
                discountPrice: 0,
                totalPriceProductDiscount: 0,
                totalPriceCouponDiscount: 0,
                totalPriceCoinDiscount: 0
            }

            if (cartDetailIdSelecteds.length > 0) {

                //filter coupons
                const couponsFilter = coupons.filter(x => couponCodeSelecteds.some(y => y.couponCode === x.couponCode));

                // filter cart detail
                const cartDetailSelected = filterCartDetail(cartDetailIdSelecteds);;

                // calculator price
                if (cartDetailSelected) {
                    let totalOriginPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue.productVariantPrice * currentValue.quantity);
                    }, 0);


                    let totalDiscountPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (discountPrice(currentValue.productVariantPrice, currentValue.productDiscount) * currentValue.quantity);
                    }, 0);

                    // total price discount product
                    const newTotalPriceProductDiscount = totalOriginPrice - totalDiscountPrice;

                    // total price coupons shop
                    let newTotalPriceCouponDiscount = 0;
                    if (couponsFilter) {
                        newTotalPriceCouponDiscount = couponsFilter.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.priceDiscount;
                        }, 0);

                        // sub total discount price
                        totalDiscountPrice -= newTotalPriceCouponDiscount;
                    }

                    // total price coin
                    let totalPriceCoinDiscount = 0;
                    if (isUseCoin) {
                        if (userCoin > 0) {
                            if (totalOriginPrice >= userCoin) {
                                totalPriceCoinDiscount = userCoin;
                            } else {
                                totalPriceCoinDiscount = totalOriginPrice;
                            }
                        } else {
                            totalPriceCoinDiscount = 0;
                        }

                        // sub total discount price
                        totalDiscountPrice -= totalPriceCoinDiscount;
                    }

                    newTotalPrice = {
                        ...totalPrice,
                        originPrice: totalOriginPrice > 0 ? totalOriginPrice : 0,
                        discountPrice: totalDiscountPrice > 0 ? totalDiscountPrice : 0,
                        totalPriceProductDiscount: newTotalPriceProductDiscount > 0 ? newTotalPriceProductDiscount : 0,
                        totalPriceCouponDiscount: newTotalPriceCouponDiscount > 0 ? newTotalPriceCouponDiscount : 0,
                        totalPriceCoinDiscount: totalPriceCoinDiscount > 0 ? totalPriceCoinDiscount : 0
                    }
                }
            }



            setTotalPrice(newTotalPrice);
        }

        calculatorPrice(cartDetailIdSelecteds)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds, carts, couponCodeSelecteds, isUseCoin])
    ///




    /// functions

    const filterCartDetail = (cartDetailIds) => {
        const cartDetails = [];
        for (let i = 0; i < carts.length; i++) {
            const products = carts[i].products;
            const filterProducts = products.filter(x => cartDetailIds.includes(x.cartDetailId));

            if (filterProducts) {
                cartDetails.push(filterProducts);
            }
        }
        return [].concat(...cartDetails);
    }

    const reloadCarts = () => {
        setReloadCartsFlag(!reloadCartsFlag);
    }

    const findCartItems = (productVariantIds) => {
        const cartItem = carts.map((cart) => {
            const { products } = cart;
            const productItem = products.filter(p => productVariantIds.includes(p.productVariantId))
            return productItem;
        })
        return [].concat(...cartItem);
    }
    ///


    /// props
    const dataPropProductComponent = {
        userId: userId,
        carts: carts,
        cartDetailIdSelecteds: cartDetailIdSelecteds,
        setCartDetailIdSelecteds: setCartDetailIdSelecteds,
        handleOnChangeCheckbox: handleOnChangeCheckbox,
        reloadCarts: reloadCarts,
        couponCodeSelecteds: couponCodeSelecteds,
        setCouponCodeSelecteds: setCouponCodeSelecteds,
        coupons: coupons,
        setCoupons: setCoupons,
        getCouponCodeSelecteds: getCouponCodeSelecteds,
        totalPrice: totalPrice,
    }

    const dataPropPriceComponent = {
        userId: userId,
        carts: carts,
        totalPrice: totalPrice,
        userCoin: userCoin,
        setIsUseCoin: setIsUseCoin,
        balance: balance,
        filterCartDetail: filterCartDetail,
        cartDetailIdSelecteds: cartDetailIdSelecteds,
        isUseCoin: isUseCoin,
        reloadCarts: reloadCarts,
        couponCodeSelecteds,
        getCouponCodeSelecteds: getCouponCodeSelecteds
    }
    ///

    return (
        <>
            {
                carts.length > 0 ? (<div id='container-cart'>
                    <Spinning wrapperClassName={cx('ant-spin-container', 'ant-spin-dot')} spinning={isLoadingCartInfo}>
                        <Row>
                            <Products dataPropProductComponent={dataPropProductComponent} />
                            <Prices dataPropPriceComponent={dataPropPriceComponent} />
                        </Row>
                    </Spinning>
                </div>
                ) : (<Title level={4} style={{ width: '100%', textAlign: 'center' }}>Không có sản phẩm nào trong giỏ hàng</Title>)
            }

        </>
    )
}

export default Cart

