import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import React, { useState, useEffect } from "react";
import CarouselCustom from '~/components/Carousels/CarouselCustom';
import { addProductToCart } from '~/api/cart';
import { isProductWishList, addWishList, removeWishList } from '~/api/wishList';
import { formatPrice } from '~/utils';
import { useNavigate } from 'react-router-dom';
import ModalAlert from '~/components/Modals/ModalAlert';
import { RESPONSE_CODE_CART_PRODUCT_INVALID_QUANTITY, RESPONSE_CODE_CART_SUCCESS, PRODUCT_BAN, RESPONSE_CODE_SUCCESS } from '~/constants';
import { CreditCardOutlined, ShoppingCartOutlined, HeartFilled } from '@ant-design/icons';
import { Col, Row, Button, Divider, Spin, Skeleton, InputNumber, Radio, Card, Typography, Space } from 'antd';

const ProductVariantDetail = ({ productVariants, handleSelectProductVariant, productVariantsSelected, product, openNotification, userId }) => {

    /// states
    const [quantity, setQuantity] = useState(1);
    const [isModalNotifyQuantityOpen, setIsModalNotifyQuantityOpen] = useState(false);
    const [contentProductInvalidQuantity, setContentProductInvalidQuantity] = useState('');
    const [isWishList, setIsWishList] = useState(false);
    ///

    const cx = classNames.bind(styles);
    const { Title, Text } = Typography;
    require('moment/locale/vi');
    const navigate = useNavigate();

    /// variables
    let minPrice = 0
    let maxPrice = 0
    let minPriceDis = 0
    let maxPriceDis = 0
    ///



    /// handles
    const showModalNotifyQuantity = () => {
        setIsModalNotifyQuantityOpen(true);
    };

    const handleOk = () => {
        setIsModalNotifyQuantityOpen(false);
    };

    const handleChangeQuantity = (value) => {
        setQuantity(value)
    }

    const handleAddProductToCart = async (isBuyNow) => {
        console.log('productVariantsSelected: ' + JSON.stringify(productVariantsSelected));

        if (userId === undefined) {
            navigate('/login')
            return;
        }

        if (!productVariantsSelected) {
            openNotification("error", "Vui lòng chọn loại sản phẩm")
            return;
        }

        const dataAddToCart = {
            userId: userId,
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
                            openNotification("success", "Sản phẩm đã được thêm vào trong giỏ hàng của bạn")
                        } else {
                            navigate('/cart')
                        }
                    }
                }
            })
            .catch((errors) => {
                console.log(errors)
                openNotification("error", "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!")
            })
    }

    const handleClickWishList = () => {
        if (userId === undefined) {
            navigate('/login')
            return;
        }

        // data request dto
        const dataRequest = {
            userId: userId,
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
                            openNotification("success", "Xóa thành công khỏi mục sản phẩm yêu thích");
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
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
                            openNotification("success", "Thêm thành công vào mục sản phẩm yêu thích");
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
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
                style={carouselStyle}
            />
        )
    }
    ///

    /// functions
    const PriceFormat = ({ price }) => {
        const formattedPrice = formatPrice(price);
        return formattedPrice;
    }

    const discountPrice = (price, discount) => {
        const result = price * discount / 100
        return (price - result)
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

    console.log('userId = ' + userId);

    // wish list
    useEffect(() => {
        if (product && userId) {
            isProductWishList(product.productId, userId)
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
    }, [product, userId]);
    ///

    /// styles
    const carouselStyle = { width: '100%', height: '50vh' };
    const buttonStyle = {
        background: 'white',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
    };
    const iconStyle = {
        fontSize: '24px',
        color: isWishList ? '#dc3545' : 'gray'
    };
    ///

    if (product) {
        minPrice = rangePrice(product.productVariants)[0];
        maxPrice = rangePrice(product.productVariants)[1];
        minPriceDis = discountPrice(minPrice, product.discount);
        maxPriceDis = discountPrice(maxPrice, product.discount);
    }


    return (
        <Card className={disableProduct() ? cx('margin-bottom', 'disable-item') : cx('margin-bottom')}>
            <Row>
                {product ? (<>
                    <Col span={11} style={{ padding: 15, position: 'relative' }}>
                        <ProductMedias productMedias={product.productMedias} />
                        {
                            disableProduct() ? <div className={cx('circle')}> Sản phẩm này đã bị BAN</div> : <></>
                        }
                    </Col>
                    <Col span={13} style={{ padding: 15 }}>
                        <div className={disableProduct() ? cx('pointer-events-item') : ''}>
                            <Title level={3}>{product.productName}</Title>
                            <div className={cx('space-div-flex')}>
                                {productVariantsSelected ? (
                                    <Title level={4}><PriceFormat price={discountPrice(productVariantsSelected.price, product.discount)} /></Title>
                                ) : (
                                    <>
                                        {
                                            product.productVariants.length > 1 ? (<Title level={4}>{<PriceFormat price={minPriceDis} />} - {<PriceFormat price={maxPriceDis} />}</Title>)
                                                : (product.productVariants.length === 1 ? <Title level={4}>{<PriceFormat price={discountPrice(product.productVariants[0].price, product.discount)} />}</Title> : <></>)
                                        }
                                    </>
                                )}
                            </div>
                            <div
                                className={cx('space-div-flex')}>
                                {productVariantsSelected ? (
                                    <Text delete strong type="secondary">{<PriceFormat price={productVariantsSelected.price} />}</Text>
                                ) : (
                                    <>
                                        {
                                            product.productVariants.length > 1 ? (<Text delete strong type="secondary">
                                                {<PriceFormat price={minPrice} />} - {<PriceFormat price={maxPrice} />}
                                            </Text>)
                                                : (product.productVariants.length === 1 ? <Text delete strong type="secondary">{<PriceFormat price={product.productVariants[0].price} />}</Text> : <></>)
                                        }
                                    </>
                                )}
                                <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                            </div>
                            {
                                userId !== product.shop.shopId ? (
                                    <Space align='center'>
                                        <button style={buttonStyle} onClick={handleClickWishList}>
                                            <HeartFilled style={iconStyle} />
                                        </button>
                                    </Space>
                                ) : (<></>)
                            }

                            <Divider />
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
                            <div>
                                <Button name="btnBuyNow" onClick={() => handleAddProductToCart(true)} disabled={disableProduct() || product.quantity <= 0 || userId === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                    Mua ngay
                                </Button>
                                <Button name="btnAddToCart" onClick={() => handleAddProductToCart(false)} disabled={disableProduct() || product.quantity <= 0 || userId === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                    Thêm vào giỏ
                                </Button>
                            </div>
                        </div>

                    </Col>

                    <ModalAlert isOpen={isModalNotifyQuantityOpen} handleOk={handleOk} content={contentProductInvalidQuantity} />
                </>) : (<Skeleton active />)}
            </Row>
        </Card >
    )
}

export default ProductVariantDetail;