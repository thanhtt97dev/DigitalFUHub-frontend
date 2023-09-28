import React, { useState, useEffect } from "react"
import { useAuthUser } from 'react-auth-kit';
import { Col, Row, Image, Button, Typography, Divider, Spin, Tag, Skeleton, Card } from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import { HeartOutlined, BellOutlined, SyncOutlined, CreditCardOutlined, ShoppingCartOutlined, MessageOutlined } from '@ant-design/icons';
import { getProductById } from '~/api/product';
import { formatPrice } from '~/utils'
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

const ProductVariantDetail = ({ product, productVariants, handleSelectProductVariant, productVariantsSelected, userId }) => {

    const navigate = useNavigate()

    const TagFormat = ({ name }) => (
        <Tag color="cyan">{name}</Tag>
    )

    const handleSendMessage = () => {
        const data = {
            userId: userId,
            shopId: product.shopId
        }
        navigate('/chatBox', { state: { data: data } })
    }

    const Tags = ({ tags }) => (
        <>
            {tags ? (
                tags.map(item => <TagFormat key={item.tagId} name={item.tagName} />)
            ) : (
                <Tag icon={<SyncOutlined spin />} color="processing">
                    loading
                </Tag>
            )}
        </>
    )

    const GridItems = ({ productVariants, handleSelectProductVariant }) => (
        <div className={cx('grid-container')}>
            {productVariants ? (
                productVariants.map((item) =>
                    <div className={cx('grid-item')} key={item.productVariantId}><Button onClick={() => handleSelectProductVariant(item)}>{item.name}</Button></div>)
            ) : (
                <Spin />
            )}
        </div>
    )

    const PriceFormat = ({ price }) => {
        const formattedPrice = formatPrice(price);
        return formattedPrice;
    }

    const discountPrice = (price, discount) => {
        const result = price * discount / 100
        return (price - result)
    }

    return (
        <Row>
            {product ? (<>
                <Col span={10}
                    style={{ padding: 10 }}
                >
                    <div id="image-product">
                        <Image style={{ borderRadius: 10 }}
                            src="https://cdn.divineshop.vn/image/catalog/Anh-SP/Spotify/Divine-Shop-Goi-Gia-Han-Spotify-1-Nam-40567.jpg?hash=1658742748"
                        />
                        <Button>Xem thêm ảnh</Button>
                    </div>
                </Col>
                <Col span={14}
                    style={{ padding: 10 }}
                >
                    <div>
                        <Title level={3}>{product.productName} ({productVariantsSelected.name})</Title>
                        <div className={cx('space-div-flex')}>
                            <Text strong>Tình trạng: </Text>
                            &nbsp;&nbsp;
                            {
                                productVariantsSelected.quantity > 0 ?
                                    (<Text type="success" strong>Còn hàng</Text>)
                                    : (<Text type="danger" strong>Hết hàng</Text>)
                            }
                        </div>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <Text strong>Thể loại: </Text>
                            &nbsp;&nbsp;
                            <div>
                                <Tags tags={product.tags} />
                            </div>
                        </div>
                        <div className={cx('space-div-flex')}>
                            <Title level={4}><PriceFormat price={productVariantsSelected.price} /></Title>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và đăng ký nhận thông báo khi sản phẩm giảm giá"><BellOutlined /></Button>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và thêm vào danh sách yêu thích"><HeartOutlined /></Button>
                        </div>
                        <div
                            className={cx('space-div-flex')}
                        >
                            <Text delete strong type="secondary"
                                style={{ fontSize: 15 }}
                            >{<PriceFormat price={discountPrice(productVariantsSelected.price, product.discount)} />}</Text>
                            <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                        </div>
                        <Divider />
                        <div>
                            <Title level={4}>Chọn thời hạn</Title>
                            <GridItems productVariants={productVariants} handleSelectProductVariant={handleSelectProductVariant} />
                        </div>
                        <Divider />
                        <div

                        >
                            <Button className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                Mua ngay
                            </Button>
                            <Button className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                Thêm vào giỏ
                            </Button>
                            <Button className={cx('margin-element')} type="primary" shape="round" icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage}>
                                Nhắn tin
                            </Button>
                        </div>
                    </div>

                </Col>
            </>) : (<Skeleton active />)}
        </Row>
    )
}


const ProductDescription = ({ product }) => {
    return (
        <Row
        >
            {

                product ? (<>
                    <Col span={5}>
                        <Title level={4}>Chi tiết sản phẩm</Title>
                    </Col>
                    <Col span={19}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Text>{product.description}</Text>
                    </Col>
                </>) : (<>
                    <Skeleton active />
                </>)
            }

        </Row>
    )
}

const ProductSuggestions = () => {
    const CardProduct = () => (
        <Card bordered={false} style={{ width: '45vh' }} bodyStyle={{ padding: 8 }}>
            <Image style={{ borderRadius: 10, marginBottom: 7 }}
                src="https://cdn.divineshop.vn/image/catalog/Anh-SP/Spotify/Divine-Shop-Goi-Gia-Han-Spotify-1-Nam-40567.jpg?hash=1658742748"
            />
            <Text strong>Gói gia hạn Spotify Premium 01 năm</Text>
            <p>Card content</p>
        </Card>
    )

    return (
        <>
            <Row>
                <Col><Title level={4}>Sản phẩm liên quan</Title></Col>
            </Row>
            <Row>
                <Col className={cx('grid-product-suggest')}>
                    <CardProduct />
                    <CardProduct />
                    <CardProduct />
                    <CardProduct />
                    <CardProduct />
                    <CardProduct />
                </Col>
            </Row>
        </>
    )
}


const ProductDetail = () => {
    const auth = useAuthUser();
    const user = auth();
    const initialProductId = 2;
    const [product, setProduct] = useState(null)
    const [productVariants, setProductVariants] = useState([])
    const [productVariantsSelected, setProductVariantsSelected] = useState(null)

    const handleSelectProductVariant = (item) => {
        setProductVariantsSelected(item)
        console.log('item is: ' + JSON.stringify(item))
    }

    useEffect(() => {
        const getDetailProduct = () => {
            getProductById(initialProductId)
                .then((response) => {
                    setProduct(response.data)
                    setProductVariants([...response.data.productVariants])
                    setProductVariantsSelected(response.data.productVariants[0])
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }

        getDetailProduct();
    }, [])


    return (
        <>
            <ProductVariantDetail
                product={product}
                productVariants={productVariants}
                handleSelectProductVariant={handleSelectProductVariant}
                productVariantsSelected={productVariantsSelected}
                userId={user.id} />
            <Divider />
            <ProductDescription product={product} />
            <Divider />
            <ProductSuggestions />
        </>
    )
}

export default ProductDetail

