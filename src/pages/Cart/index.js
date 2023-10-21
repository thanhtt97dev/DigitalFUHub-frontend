import React, { useEffect, useState } from 'react';
import Products from '~/components/Cart/Products';
import Prices from '~/components/Cart/Prices';
import { useAuthUser } from 'react-auth-kit';
import { getCustomerBalance } from '~/api/user';
import { getCartsByUserId } from '~/api/cart';


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
    const [itemCartSelected, setItemCartSelected] = useState([]);
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [userCoin, setUserCoin] = useState(0);
    const [balance, setBalance] = useState(0);



    const [isModelInvalidCartProductQuantity, setIsModelInvalidCartProductQuantity] = useState(false)
    const [isModelInvalidCartQuantity, setIsModelInvalidCartQuantity] = useState(false)
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);




    /// handles

    const handleOnChangeCheckbox = (values) => {
        if (values.length === 0) {
            setItemCartSelected([])
            return;
        }

        const cartItems = findCartItems(values)
        setItemCartSelected([...cartItems])

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

    // const handleChangeCoin = (e) => {
    //     setIsUseCoin(e.target.checked);
    // }

    const checkAllGroup = (shopId) => {
        const itemCarts = carts.find(x => x.shopId === shopId).products;
        const itemCartSelectedFilter = itemCartSelected.filter(x => itemCarts.some(y => x === y))
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
    }, [reloadCartsFlag])

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

    return (
        <>
            <Products />
            <Prices />
        </>
    )
}

export default Cart

