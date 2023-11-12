import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import React, { useState, useEffect, useContext } from "react";
import CarouselCustom from './Carousel';
import { addProductToCart } from '~/api/cart';
import { NotificationContext } from '~/context/UI/NotificationContext';
import { useAuthUser } from 'react-auth-kit';
import { isProductWishList, addWishList, removeWishList } from '~/api/wishList';
import { discountPrice, formatPrice } from '~/utils';
import { useNavigate } from 'react-router-dom';
import ModalAlert from '~/components/Modals/ModalAlert';
import { RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_SUCCESS, PRODUCT_BAN, RESPONSE_CODE_SUCCESS } from '~/constants';
import { CreditCardOutlined, ShoppingCartOutlined, HeartFilled } from '@ant-design/icons';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Radio, Card, Typography, Space, Rate } from 'antd';

///
const cx = classNames.bind(styles);
const { Title, Text } = Typography;
require('moment/locale/vi');
///

/// styles
const buttonStyle = {
    background: 'white',
    cursor: 'pointer',
};

const numberRatingStarStyle = {
    color: '#ee4d2d',
    fontSize: 19,
    borderBottom: '1px solid #ee4d2d'
}

const ratingStarStyle = {
    color: '#ee4d2d',
    fontSize: 19,
    borderBottom: '1px solid white'
}
const numberFeedbackProductStyle = { fontSize: 19, borderBottom: '1px solid black' }
const feedbackProductStyle = { fontSize: 16 }
const spaceRatingStarStyle = { paddingRight: 25, borderRight: '1px solid rgb(232, 232, 232)', cursor: 'pointer' }
const spaceFeedbackStyle = { paddingLeft: 25, cursor: 'pointer', marginBottom: 30 }
const styleSpacePrice = { backgroundColor: '#fafafa', width: '100%', height: '13vh', padding: 15, marginBottom: 20 }
const styleOriginPrice = { fontSize: '1rem', }
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1.875rem', fontWeight: 500 }
///

const ProductVariantDetail = ({ productVariants, handleSelectProductVariant, productVariantsSelected, product, scrollToStartFeedback }) => {

    /// states
    const [quantity, setQuantity] = useState(1);
    const [isModalNotifyQuantityOpen, setIsModalNotifyQuantityOpen] = useState(false);
    const [contentProductInvalidQuantity, setContentProductInvalidQuantity] = useState('');
    const [isLoadingButtonWishList, setIsLoadingButtonWishList] = useState(false);
    const [isLoadingButtonBuyNow, setIsLoadingButtonBuyNow] = useState(false);
    const [isLoadingButtonAddToCart, setIsLoadingButtonAddToCart] = useState(false);
    const [isWishList, setIsWishList] = useState(false);
    const [productVariantDefault, setProductVariantDefault] = useState({});
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///


    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// router
    const navigate = useNavigate();
    ///

    /// handles

    const calculatorRatingStarProduct = () => {
        if (!product) return 0;
        return product.totalRatingStar / product.numberFeedback;
    }

    const showModalNotifyQuantity = () => {
        setIsModalNotifyQuantityOpen(true);
    };

    const handleOk = () => {
        setIsModalNotifyQuantityOpen(false);
    };

    const handleChangeQuantity = (value) => {
        setQuantity(value)
    }

    const loadingButtonWishList = () => {
        setIsLoadingButtonWishList(true);
    }

    const unLoadingButtonWishList = () => {
        setIsLoadingButtonWishList(false);
    }

    const loadingButtonBuyNow = () => {
        setIsLoadingButtonBuyNow(true);
    }

    const unLoadingButtonBuyNow = () => {
        setIsLoadingButtonBuyNow(false);
    }

    const loadingButtonAddToCart = () => {
        setIsLoadingButtonAddToCart(true);
    }

    const unLoadingButtonAddToCart = () => {
        setIsLoadingButtonAddToCart(false);
    }

    const handleAddProductToCart = async (isBuyNow) => {
        // loading button
        isBuyNow ? loadingButtonBuyNow() : loadingButtonAddToCart();

        if (user === undefined || user === null) {
            // un loading button
            isBuyNow ? unLoadingButtonBuyNow() : unLoadingButtonAddToCart();
            navigate('/login');
            return;
        }

        if (!productVariantsSelected) {
            // un loading button
            isBuyNow ? unLoadingButtonBuyNow() : unLoadingButtonAddToCart();
            notification("error", "Vui lòng chọn loại sản phẩm");
            return;
        }

        const dataAddToCart = {
            userId: user.id,
            shopId: product.shop.shopId,
            productVariantId: productVariantsSelected.productVariantId,
            quantity: quantity
        }

        addProductToCart(dataAddToCart)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY && data.status.ok === false) {
                        const message = `Sản phẩm này đang có số lượng ${data.result} trong giỏ hàng của bạn,
                        không thể thêm số lượng đã chọn vào giỏ hàng vì đã vượt quá số lượng sản phẩm có sẵn`
                        setContentProductInvalidQuantity(message);
                        showModalNotifyQuantity();

                    } else if (data.status.responseCode === RESPONSE_CODE_CART_SUCCESS && data.status.ok === true) {
                        if (!isBuyNow) {
                            notification("success", "Sản phẩm đã được thêm vào trong giỏ hàng của bạn");
                        } else {
                            navigate('/cart')
                        }
                    }
                }
            })
            .catch((errors) => {
                console.log(errors);
                notification("error", "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
            }).finally(() => {
                setTimeout(() => {
                    // un loading button
                    isBuyNow ? unLoadingButtonBuyNow() : unLoadingButtonAddToCart();
                }, 500)
            });
    }

    const handleClickWishList = () => {
        // loading button wish list is TRUE
        loadingButtonWishList();

        if (user === undefined || user === null) {
            navigate('/login');
            return;
        }

        // data request dto
        const dataRequest = {
            userId: user.id,
            productId: product.productId
        }

        if (isWishList) {
            // remove wish list
            removeWishList(dataRequest)
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data;
                        const status = data.status;
                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setIsWishList(false);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setTimeout(() => {
                        // loading button wish list is FALSE
                        unLoadingButtonWishList();
                        notification("success", "Xóa thành công khỏi mục sản phẩm yêu thích");
                    }, 500)
                });
        } else {
            // add wish list
            addWishList(dataRequest)
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data;
                        const status = data.status;
                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setIsWishList(true);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setTimeout(() => {
                        // loading button wish list is FALSE
                        unLoadingButtonWishList();
                        notification("success", "Thêm thành công vào mục sản phẩm yêu thích");
                    }, 500)
                });;
        }
    }
    ///

    /// child components
    const GridItems = ({ productVariants, handleSelectProductVariant }) => (
        <div className={cx('grid-container')}>
            {productVariants ? (
                productVariants.map((item) =>
                    <div className={cx('grid-item')} key={item.productVariantId}>
                        <Button disabled={item.quantity > 0 ? false : true} type={productVariantsSelected ? (productVariantsSelected === item ? 'primary' : 'default') : ('default')} onClick={() => handleSelectProductVariant(item)}>{item.name}</Button>
                    </div>)
            ) : (
                <Spin />
            )}
        </div>
    )

    const ProductMedias = ({ productMedias }) => {
        return (
            <CarouselCustom
                data={productMedias}
            />
        )
    }
    ///

    /// functions
    const PriceFormat = ({ price }) => {
        const formattedPrice = formatPrice(price);
        return formattedPrice;
    }

    const rangePrice = (productVariants) => {
        const prices = productVariants?.map(variant => variant.price);
        return [Math.min(...prices), Math.max(...prices)]
    }

    const disableProduct = () => {
        return product?.productStatusId === PRODUCT_BAN ? true : false;
    }
    ///

    /// useEffect
    useEffect(() => {
        setQuantity(1)
    }, [handleSelectProductVariant]);

    // get product variant hav price minimum
    useEffect(() => {
        if (productVariants.length === 0) return;
        const productVariantPriceMinimum = productVariants.reduce((min, product) => {
            return discountPrice(product.price, product.discount) < discountPrice(min.price, min.discount) ? product : min;
        }, productVariants[0]);

        setProductVariantDefault(productVariantPriceMinimum);

    }, [productVariants]);

    // wish list
    useEffect(() => {
        if (product && (user !== undefined && user !== null)) {
            isProductWishList(product.productId, user.id)
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data;
                        const status = data.status;
                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            const result = data.result;
                            setIsWishList(result);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setIsWishList(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, user]);
    ///

    /// styles
    const iconStyle = {
        fontSize: '25px',
        color: isWishList ? '#dc3545' : 'lightgray'
    };
    ///

    return (
        <Card className={disableProduct() ? cx('margin-bottom', 'opacity-disabled') : cx('margin-bottom')}>
            <Row>
                {product ? (<>
                    <Col span={10} style={{ padding: 15 }}>
                        <ProductMedias productMedias={product.productMedias} />
                        {
                            disableProduct() ? <div className={cx('circle')}> Sản phẩm này đã bị BAN</div> : <></>
                        }
                    </Col>
                    <Col offset={1} span={13} style={{ padding: 15 }}>
                        <div className={disableProduct() ? cx('pointer-events-item') : ''}>
                            <Title level={3}>{product.productName}</Title>
                            <Space align='center' style={spaceRatingStarStyle} onClick={scrollToStartFeedback}>
                                <Text style={numberRatingStarStyle}>{calculatorRatingStarProduct() ? calculatorRatingStarProduct().toFixed(1) : 0}</Text>
                                <Rate disabled defaultValue={calculatorRatingStarProduct()} style={ratingStarStyle} />
                            </Space>
                            <Space align='center' style={spaceFeedbackStyle} onClick={scrollToStartFeedback}>
                                <Text style={numberFeedbackProductStyle}>{product.numberFeedback}</Text>
                                <Text style={feedbackProductStyle} type="secondary">Đánh giá</Text>
                            </Space>
                            <Space align='center' className={cx('space-div-flex')} size={20} style={styleSpacePrice}>
                                <Text delete strong type="secondary" style={styleOriginPrice}>{<PriceFormat price={productVariantsSelected ? productVariantsSelected.price : productVariantDefault.price} />}</Text>
                                <p level={4} style={styleDiscountPrice}><PriceFormat price={discountPrice(productVariantsSelected ? productVariantsSelected.price : productVariantDefault.price, productVariantsSelected ? productVariantsSelected.discount : productVariantDefault.discount)} /></p>
                                <div className={cx('discount-style')}>{productVariantsSelected ? productVariantsSelected.discount : productVariantDefault.discount}% giảm</div>
                            </Space>
                            <div style={{ marginBottom: 20 }}>
                                <Title level={4}>Loại sản phẩm</Title>
                                <Radio.Group>
                                    <GridItems productVariants={productVariants} handleSelectProductVariant={handleSelectProductVariant} />
                                </Radio.Group>
                            </div>
                            <div className={cx('space-div-flex')}>
                                <Text strong>Số lượng: </Text>
                                &nbsp;&nbsp;
                                <InputNumber min={1} max={productVariantsSelected?.quantity || product.quantity} defaultValue={1} onChange={handleChangeQuantity} value={quantity} />
                                &nbsp;&nbsp;
                                {productVariantsSelected ? (<Text type="secondary" strong>{productVariantsSelected.quantity} sản phẩm có sẵn</Text>)
                                    : (<Text type="secondary" strong>{product.quantity} sản phẩm có sẵn</Text>)}

                            </div>
                            <Divider />
                            <Space align='center'>
                                <Button name="btnBuyNow" onClick={() => handleAddProductToCart(true)} disabled={disableProduct() || product.quantity <= 0 || user?.id === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" icon={<CreditCardOutlined />} size={'large'} loading={isLoadingButtonBuyNow}>
                                    Mua ngay
                                </Button>
                                <Button name="btnAddToCart" onClick={() => handleAddProductToCart(false)} disabled={disableProduct() || product.quantity <= 0 || user?.id === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" icon={<ShoppingCartOutlined />} size={'large'} loading={isLoadingButtonAddToCart}>
                                    Thêm vào giỏ
                                </Button>
                                {
                                    user?.id !== product.shop.shopId ? (
                                        <Button style={buttonStyle} onClick={handleClickWishList} size={'large'} className={cx('flex-item-center')} loading={isLoadingButtonWishList}>
                                            <HeartFilled style={iconStyle} />
                                        </Button>
                                    ) : (<></>)
                                }
                            </Space>
                        </div>

                    </Col>

                    <ModalAlert isOpen={isModalNotifyQuantityOpen} handleOk={handleOk} content={contentProductInvalidQuantity} />
                </>) : (<Skeleton active />)}
            </Row>
        </Card >
    )
}

export default ProductVariantDetail;