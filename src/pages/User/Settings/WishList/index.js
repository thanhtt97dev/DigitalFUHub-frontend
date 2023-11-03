import React, { useEffect, useState } from "react";
import { Card, Typography, Col, Row, Space, Image, Button } from 'antd';
import { useAuthUser } from 'react-auth-kit';
import { getWishListByUserId, removeWishList } from '~/api/wishList';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { formatPrice, discountPrice } from '~/utils';
import classNames from 'classnames/bind';
import styles from '~/pages/User/Settings/WishList/WishList.module.scss';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);


const RangeOriginPriceProductVariant = ({ productVariants }) => {
    const priceProductVariant = productVariants.map(x => x.price);
    const minPrice = Math.min(...priceProductVariant);
    const maxPrice = Math.max(...priceProductVariant);

    return <Text delete strong type="secondary">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</Text>
}

const RangeDiscountPriceProductVariant = ({ productVariants, discount }) => {
    const priceProductVariant = productVariants.map(x => x.price);
    const minPrice = discountPrice(Math.min(...priceProductVariant), discount);
    const maxPrice = discountPrice(Math.max(...priceProductVariant), discount);

    return <Text strong>{formatPrice(minPrice)} - {formatPrice(maxPrice)}</Text>
}

const WishList = () => {
    /// states
    const [products, setProducts] = useState([]);
    const [reloadProductsFlag, setReloadProductsFlag] = useState(false);
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    const userId = user?.id;
    ///

    /// useEffects
    useEffect(() => {
        if (userId === undefined) return;
        getWishListByUserId(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setProducts(result);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadProductsFlag]);
    ///


    /// handles
    const handleRemoveWishList = (productId) => {
        if (userId === undefined) return;
        const dataRequestRemove = {
            userId: userId,
            productId: productId
        }

        removeWishList(dataRequestRemove)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadProducts();
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    ///


    /// functions
    const reloadProducts = () => {
        setReloadProductsFlag(!reloadProductsFlag);
    }
    ///

    return (
        <Card title="Danh sách các sản phẩm yêu thích">
            {
                <Space size={[10, 16]} wrap>
                    {products.map((product, index) => (
                        <Card hoverable style={{ width: '35vh', height: '55vh' }} bodyStyle={{ padding: 10 }}>
                            <Row>
                                <Col>
                                    <Image width={160} height={200} src={product.thumbnail} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Space>
                                        <Space.Compact direction="vertical">
                                            <Link to={'/product/' + product.productId} ><Title level={4}>{product.productName}</Title></Link>
                                            <Space align="center">
                                                {product.productVariants.length > 1 ? (<RangeOriginPriceProductVariant productVariants={product.productVariants} />)
                                                    : (product.productVariants.length === 1 ? <Text delete strong type="secondary">{formatPrice(product.productVariants[0].price)}</Text> : <></>)}
                                                <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                                            </Space>

                                            {product.productVariants.length > 1 ? (<RangeDiscountPriceProductVariant productVariants={product.productVariants} discount={product.discount} />)
                                                : (product.productVariants.length === 1 ? <Text strong>{formatPrice(discountPrice(product.productVariants[0].price, product.discount))}</Text> : <></>)}


                                            <Space align="center">
                                                <Link to={'/product/' + product.productId} >
                                                    <Button type="link" icon={<ShoppingCartOutlined />}>
                                                        Thêm vào giỏ
                                                    </Button>
                                                </Link>
                                                <Button type="link" icon={<DeleteOutlined />} onClick={() => { handleRemoveWishList(product.productId) }}>
                                                    Xóa
                                                </Button>
                                            </Space>


                                        </Space.Compact>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    {/* <Col span={10}>
                                    <Space>
                                        <Space.Compact direction="vertical">
                                            <Title level={3}>{product.productName}</Title>
                                            <Button type="link" icon={<ShoppingCartOutlined />}>
                                                Thêm vào giỏ
                                            </Button>
                                        </Space.Compact>
                                    </Space>
                                </Col>
                                <Col span={5}>

                                </Col>
                                <Col span={3}>

                                </Col> */}
                </Space>


            }
        </Card>
    )
}

export default WishList;


