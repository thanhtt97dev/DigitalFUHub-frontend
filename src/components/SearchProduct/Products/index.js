import { useNavigate } from "react-router-dom";
import { Pagination, Rate, Row, Space, Typography } from 'antd';
import classNames from "classnames/bind";
import { discountPrice, formatNumber, formatPrice } from "~/utils";
import styles from "../SearchProduct.module.scss"
import { PAGE_SIZE_SEARCH_PRODUCT, PRODUCT_BAN } from "~/constants";
const cx = classNames.bind(styles);
const { Text } = Typography

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = { color: '#ee4d2d', fontSize: '.625rem', borderBottom: '1px solid white' }
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const styleOriginPrice = { fontSize: 14 };
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 };
const opacityDisabledStyle = { opacity: 0.5 };
const styleSpaceContainerProductItem = { padding: 8, height: 124, width: '100%' };
const styleProductName = { fontSize: 12, color: '#000000', cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' };
///
function Products({ totalItems = 0, products = [], page = 1, onSelectPage = () => { } }) {
    const navigate = useNavigate();
    const handleClickToProduct = (productId) => {
        return navigate(`/product/${productId}`);
    }
    return (
        <div style={{ marginTop: '0.8em' }}>
            <Space direction="vertical" style={{ width: '100%' }}>

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
                                <p style={styleProductName} title={product.productName}>{product.productName}</p>
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
                    <Pagination hideOnSinglePage showSizeChanger={false} current={page} defaultCurrent={1} total={totalItems} pageSize={PAGE_SIZE_SEARCH_PRODUCT} onChange={onSelectPage} />
                </Row>
            </Space>
        </div>
    );
}
export default Products;