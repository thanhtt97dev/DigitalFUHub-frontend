import React, { useEffect, useState } from "react";
import { getProductByUserId } from "~/api/product";
import { RESPONSE_CODE_SUCCESS, PRODUCT_BAN } from '~/constants';
import classNames from 'classnames/bind';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, discountPrice, formatNumber } from '~/utils';
import { Col, Row, Button, Divider, Image, Skeleton, Input, Radio, Card, Typography, Space, Rate, Avatar } from 'antd';


///
const { Title, Text } = Typography;
const cx = classNames.bind(styles);
///

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = {
    color: '#ee4d2d',
    fontSize: '.625rem',
    borderBottom: '1px solid white'
}
const styleContainerImage = { width: '100%', textAlign: 'center' }
const disableCardStyle = { padding: 10, opacity: 0.4, pointerEvents: 'none' };
const paddingCartBodyStyle = { padding: 10 }
const styleOriginPrice = { fontSize: 14 }
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 }
///
const ProductList = ({ userId }) => {

    /// states
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    ///

    /// handles
    const loadingProducts = () => {
        setIsLoadingProducts(true);
    }

    const unLoadingProducts = () => {
        setIsLoadingProducts(false);
    }
    ///

    /// useEffects
    useEffect(() => {
        // initial
        const initalPage = 1;

        getProductByUserId(userId, initalPage)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result.products;
                        setProducts(result);

                        // unloading products
                        unLoadingProducts();
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [userId])
    ///



    return (
        <Space direction="vertical">
            <Space align="center">
                <p>Tìm kiếm</p>
                <Input placeholder="Basic usage" />
            </Space>
            <Space size={[10, 16]} wrap>
                {products.map((product, index) => (
                    <div key={index} className={cx('item-product')}>
                        <div style={styleContainerImage}>
                            <img style={styleImage} src={product.thumbnail} alt="product" />
                            {
                                product.productStatusId === PRODUCT_BAN ? <div className={cx('circle')}> Sản phẩm này đã bị ẩn</div> : <></>
                            }
                        </div>
                        <Space direction="vertical" style={{ padding: 8, height: 124, width: '100%' }}>
                            <Link to={'/product/' + product.productId}><p style={{ fontSize: 12, color: '#000000', cursor: 'pointer' }}>{product.productName}</p></Link>
                            {
                                product.productVariant?.discount !== 0 ? (<>
                                    <div className={cx('discount-style')}><p style={{ fontSize: 10 }}>{product.productVariant.discount}% giảm</p></div>
                                    <Space align="center">
                                        <Text delete strong type="secondary" style={styleOriginPrice}>{formatPrice(product.productVariant.price)}</Text>
                                        <Text style={styleDiscountPrice}>{formatPrice(discountPrice(product.productVariant.price, product.productVariant.discount))}</Text>
                                    </Space>
                                </>
                                ) : (<p level={4} style={styleDiscountPrice}>{formatPrice(product.productVariant.price)}</p>)
                            }
                            <Space align="center" style={{ marginTop: 5 }}>
                                <Rate disabled defaultValue={product.totalRatingStar / product.numberFeedback} style={ratingStarStyle} />
                                <p style={{ fontSize: 12 }}>Đã bán {formatNumber(product.soldCount)}</p>
                            </Space>

                        </Space>

                    </div>
                ))}
            </Space>
        </Space>)
}

export default ProductList;