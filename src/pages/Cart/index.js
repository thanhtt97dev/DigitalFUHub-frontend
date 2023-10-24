import React, { useEffect, useState } from 'react';
import Products from '~/components/Cart/Products';
import Prices from '~/components/Cart/Prices';
import { useAuthUser } from 'react-auth-kit';
import { getCustomerBalance } from '~/api/user';
import { getCartsByUserId } from '~/api/cart';
import { Row } from 'antd';
import { discountPrice } from '~/utils';


const Cart = () => {
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;

    const initialTotalPrice = {
        originPrice: 0,
        discountPrice: 0,
        subPriceProductDiscount: 0,
        subPriceCouponDiscount: 0
    }

    const [carts, setCarts] = useState([])
    const [reloadCartsFlag, setReloadCartsFlag] = useState(false)
    const [cartDetailIdSelecteds, setCartDetailIdSelecteds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [userCoin, setUserCoin] = useState(0);
    const [balance, setBalance] = useState(0);



    /// handles

    const handleOnChangeCheckbox = (values) => {
        if (values.length === 0) {
            setCartDetailIdSelecteds([])
            return;
        }

        const cartItems = findCartItems(values)
        setCartDetailIdSelecteds([...cartItems])

        // const cartFilter = carts.filter(c => values.includes(c.productVariantId))
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

    // const handleChangeCoin = (e) => {
    //     setIsUseCoin(e.target.checked);
    // }

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
                    setCarts(data)
                }
                // setUserCoin(data[0].coin)
                // const { products } = data
                // if (itemCartSelected) {
                //     const newCartsSelected = products.filter(x => itemCartSelected.some(c => c.productVariant.productVariantId === x.productVariant.productVariantId));
                //     setItemCartSelected(newCartsSelected)
                // }
                // console.log('data cart = ' + data)
            })
            .catch((errors) => {
                console.log(errors)
            })

    }, [reloadCartsFlag, userId])

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

        const calculatorPrice = (cartDetailIdSelecteds) => {
            if (cartDetailIdSelecteds.length > 0) {
                const cartDetailSelected = [];

                // filter cart detail
                for (let i = 0; i < carts.length; i++) {
                    const cartDetails = carts[i].products;
                    const filterCartDetails = cartDetails.filter(x => cartDetailIdSelecteds.includes(x.cartDetailId));

                    if (filterCartDetails) {
                        cartDetailSelected.push(filterCartDetails);
                    }
                }

                // calculator price
                if (cartDetailSelected) {
                    const totalOriginPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue.productVariantPrice * currentValue.quantity);
                    }, 0);


                    const totalDiscountPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (discountPrice(currentValue.productVariantPrice, currentValue.productDiscount) * currentValue.quantity);
                    }, 0);

                    const subPriceProductDiscount = totalOriginPrice - totalDiscountPrice;

                    const newTotalPrice = {
                        originPrice: totalOriginPrice,
                        discountPrice: totalDiscountPrice,
                        subPriceProductDiscount: subPriceProductDiscount,
                        subPriceCouponDiscount: 0
                    }
                    setTotalPrice(newTotalPrice);
                }

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
            }
        }
        calculatorPrice(cartDetailIdSelecteds)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds])
    ///




    /// functions
    const findProductsByShopId = (shopId) => {
        const itemCarts = carts.find(x => x.shopId === shopId).products;

        return itemCarts;
    }

    const findProductsSelectedByShopId = (shopId) => {
        const itemCarts = carts.find(x => x.shopId === shopId).products;

        return itemCarts;
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
        setCartDetailIdSelecteds: setCartDetailIdSelecteds
    }

    const dataPropPriceComponent = {
        userId: userId,
        totalPrice: totalPrice,
    }
    ///

    return (
        <Row>
            <Products dataPropProductComponent={dataPropProductComponent} />
            <Prices dataPropPriceComponent={dataPropPriceComponent} />
        </Row>
    )
}

export default Cart

