import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { useNavigate } from 'react-router-dom';
import { formatPrice, discountPrice, formatNumber } from '~/utils';
import { PRODUCT_BAN, PAGE_SIZE_PRODUCT_HOME_PAGE } from '~/constants';
import { Row, Pagination, Card, Typography, Space, Rate, Button } from 'antd';

///
const { Text } = Typography;
const cx = classNames.bind(styles);
///

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = { color: '#ee4d2d', fontSize: '.625rem', borderBottom: '1px solid white' }
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const styleOriginPrice = { fontSize: 14 };
const styleCardInputSearch = { marginBottom: 10, borderRadius: 2, background: 'rgba(0,0,0,.03)', boxShadow: '#d3d3d3 0px 1px 2px 0px' };
const styleBodyCardInputSearch = { padding: 20 };
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 };
const opacityDisabledStyle = { opacity: 0.5 };
const styleSpaceContainerProductItem = { padding: 8, height: 124, width: '100%' };
const styleProductName = { fontSize: 12, color: '#000000', cursor: 'pointer' };
///

const Products = ({ products, searchParam, totalProducts, setSearchParam }) => {

    /// router
    const navigate = useNavigate();
    ///

    /// handles
    const handleClickToProduct = (productId) => {
        return navigate(`/product/${productId}`);;
    }

    const handleChangePage = (page) => {

        // new param search
        const newParamSearch = {
            ...searchParam,
            page: page
        }

        setSearchParam(newParamSearch);
    }

    const handleClickOrderSoldCount = () => {

        // new param search
        const newParamSearch = {
            ...searchParam,
            isOrderFeedback: false,
            isOrderSoldCount: !searchParam.isOrderSoldCount
        }

        setSearchParam(newParamSearch);
    }

    const handleClickOrderFeedback = () => {

        // new param search
        const newParamSearch = {
            ...searchParam,
            isOrderSoldCount: false,
            isOrderFeedback: !searchParam.isOrderFeedback
        }

        setSearchParam(newParamSearch);
    }
    ///

    return (<Space direction="vertical" style={{ width: '100%' }}>
        <Card bodyStyle={styleBodyCardInputSearch} style={styleCardInputSearch}>
            <Space size={20} align="center">
                <p>Sắp xếp theo</p>
                <Button onClick={handleClickOrderSoldCount} type={searchParam.isOrderSoldCount ? "primary" : "default"}>Số lượng bán</Button>
                <Button onClick={handleClickOrderFeedback} type={searchParam.isOrderFeedback ? "primary" : "default"}>Đánh giá</Button>
            </Space>
        </Card>
        <Space size={[9, 16]} wrap>
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
            <Pagination current={searchParam.page} defaultCurrent={1} total={totalProducts} pageSize={PAGE_SIZE_PRODUCT_HOME_PAGE} onChange={handleChangePage} />
        </Row>
    </Space>)
}

export default Products;