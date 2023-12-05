import React, { useEffect, useState } from "react";
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { getProductByUserId } from "~/api/product";
import { useNavigate } from 'react-router-dom';
import { formatPrice, discountPrice, formatNumber } from '~/utils';
import { RESPONSE_CODE_SUCCESS, PAGE_SIZE_PRODUCT_SHOP_DETAIL_CUSTOMER } from '~/constants';
import { Row, Pagination, FloatButton, Input, Card, Typography, Space, Rate } from 'antd';


///
const { Text } = Typography;
const cx = classNames.bind(styles);
const { Search } = Input;
///

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = { color: '#ee4d2d', fontSize: '.625rem', borderBottom: '1px solid white' }
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const styleOriginPrice = { fontSize: 14 };
const styleCardInputSearch = { marginBottom: 10, borderRadius: 2, background: 'rgba(0,0,0,.03)', boxShadow: '#d3d3d3 0px 1px 2px 0px;' };
const styleBodyCardInputSearch = { padding: 20 };
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 };
const styleSpaceContainerProductItem = { padding: 8, height: 124, width: '100%' };
const styleProductName = { fontSize: 12, color: '#000000', cursor: 'pointer' };
///
const ProductList = ({ userId, isShopBan }) => {

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
        <div className={cx('container-page-detail')}>
            <Spinning spinning={isLoadingProducts}>
                {
                    products.length > 0 ? (<>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Card bodyStyle={styleBodyCardInputSearch} style={styleCardInputSearch}>
                                <Space size={20} align="center">
                                    <p>Tìm kiếm</p>
                                    <Search
                                        placeholder="Nhập tên sản phẩm"
                                        onSearch={onSearch}
                                        style={{ width: 300 }}
                                    />
                                </Space>
                            </Card>
                            <Space size={[9, 16]} wrap>
                                {products.map((product, index) => (
                                    <div
                                        key={index}
                                        className={cx('item-product')}
                                        onClick={() => handleClickToProduct(product.productId)}
                                    >
                                        <div style={styleContainerImage}>
                                            <img style={styleImage} src={product.thumbnail} alt="product" />
                                        </div>
                                        <Space direction="vertical" style={styleSpaceContainerProductItem}>
                                            <p className={cx('three-dot-overflow-two-line-wrapper')} style={styleProductName}>{product.productName}</p>
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
                            <Row className={cx('flex-item-center', 'margin-top-40')}>
                                <Pagination current={searchParam.page} defaultCurrent={1} total={totalProducts} pageSize={PAGE_SIZE_PRODUCT_SHOP_DETAIL_CUSTOMER} onChange={handleChangePage} />
                            </Row>
                        </Space>
                        <FloatButton.BackTop visibilityHeight={0} />
                    </>) : (<></>)
                }

            </Spinning>
        </div>)
}

export default ProductList;