import React, { useState, useEffect } from "react"
import { Col, Row, Image, Button, Typography, Divider, Space, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import { HeartOutlined, BellOutlined, SyncOutlined } from '@ant-design/icons';
import { getProductById } from '~/api/product';
import { formatPrice } from '~/utils'

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

const ProductVariantDetail = ({ product, productVariants, handleSelectProductVariant, productVariantsSelected }) => {

    const TagFormat = ({ name }) => (
        <Tag color="cyan">{name}</Tag>
    )

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
                        <div style={{ display: 'flex', marginBottom: 10 }}>
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
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <Title level={4}><PriceFormat price={productVariantsSelected.price} /></Title>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và đăng ký nhận thông báo khi sản phẩm giảm giá"><BellOutlined /></Button>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và thêm vào danh sách yêu thích"><HeartOutlined /></Button>
                        </div>
                        <div
                            style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}
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
                    </div>

                </Col>
            </>) : (<div className={cx('loading-space')}>
                <Space size="middle">
                    <Spin size="large" />
                </Space>
            </div>)}
        </Row>
    )
}


const ProductDetail = () => {
    const initialProductId = 1;
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
                productVariantsSelected={productVariantsSelected} />
        </>
    )
}

export default ProductDetail

