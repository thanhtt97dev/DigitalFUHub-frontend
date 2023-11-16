import React, { useEffect, useState } from "react";
import { getProductByUserId } from "~/api/product";
import { RESPONSE_CODE_SUCCESS, PRODUCT_BAN, PAGE_SIZE } from '~/constants';
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, discountPrice, formatNumber } from '~/utils';
import { Col, Row, Button, Pagination, Select, Table, Input, Radio, Card, Typography, Space, Rate, Avatar } from 'antd';


///
const { Title, Text } = Typography;
const cx = classNames.bind(styles);
const { Search } = Input;
///

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = {
    color: '#ee4d2d',
    fontSize: '.625rem',
    borderBottom: '1px solid white'
}
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const disableCardStyle = { padding: 10, opacity: 0.4, pointerEvents: 'none' };
const paddingCartBodyStyle = { padding: 10 }
const styleOriginPrice = { fontSize: 14 }
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 }
const opacityDisabledStyle = { opacity: 0.5 }
///
const ProductList = ({ userId }) => {

    /// states
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchParam, setSearchParam] = useState({
        userId: userId,
        productName: '',
        page: 1
    });
    ///

    /// router
    const navigate = useNavigate();
    ///


    /// handles
    const loadingProducts = () => {
        setIsLoadingProducts(true);
    }

    const unLoadingProducts = () => {
        setIsLoadingProducts(false);
    }

    const handleChangePage = (page) => {

        // new param search
        const newParamSearch = {
            ...searchParam,
            page: page
        }

        setSearchParam(newParamSearch);
    }

    const onSearch = (value) => {
        // new param search
        const newParamSearch = {
            ...searchParam,
            productName: value,
            page: 1
        }

        setSearchParam(newParamSearch);
    }

    const handleClickToProduct = (productId) => {
        return navigate(`/product/${productId}`);;
    }
    ///

    /// useEffects
    useEffect(() => {
        loadingProducts();

        getProductByUserId(searchParam)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setProducts(result.products);
                        setTotalProducts(result.totalProduct);

                        // unloading products
                        unLoadingProducts();
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [userId, searchParam])
    ///



    return (
        <Spinning spinning={isLoadingProducts}>
            <Space direction="vertical">
                <Space align="center">
                    <p>Tìm kiếm</p>
                    <Search
                        placeholder="Nhập tên sản phẩm"
                        onSearch={onSearch}
                        style={{
                            width: 200,
                        }}
                    />
                </Space>
                <Space size={[10, 16]} wrap>
                    {products.map((product, index) => (
                        <div
                            style={product.quantityProductRemaining === 0 || product.productStatusId === PRODUCT_BAN ? opacityDisabledStyle : {}}
                            key={index}
                            className={cx('item-product')}
                            onClick={() => handleClickToProduct(product.productId)}
                        >
                            <div style={styleContainerImage}>
                                {
                                    product.productStatusId === PRODUCT_BAN ?
                                        <div className={cx('circle')}> Sản phẩm này đã bị ẩn</div>
                                        : product.quantityProductRemaining === 0 ? <div className={cx('circle')}>Hết hàng</div> : <></>
                                }
                                <img style={styleImage} src={product.thumbnail} alt="product" />
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
                <Pagination current={searchParam.page} defaultCurrent={1} total={totalProducts} pageSize={PAGE_SIZE} onChange={handleChangePage} />;
            </Space>
        </Spinning>)
}

export default ProductList;