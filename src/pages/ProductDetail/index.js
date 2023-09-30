import React, { useState, useEffect, createContext, useContext } from "react"
import { useAuthUser } from 'react-auth-kit';
import {
    Col, Row, Image, Button, Typography, Divider, Spin, Skeleton, Card,
    Avatar, List, Rate, InputNumber, Carousel
} from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import {
    CreditCardOutlined,
    ShoppingCartOutlined, MessageOutlined,
} from '@ant-design/icons';
import { getProductById } from '~/api/product';
import { getFeedbackByProductId } from '~/api/feedback';
import { formatPrice } from '~/utils'
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

const cx = classNames.bind(styles);
const { Title, Text } = Typography;
const ProductDetailContext = createContext()

const ProductVariantDetail = ({ productVariants, handleSelectProductVariant, productVariantsSelected }) => {
    const {
        userId,
        product
    } = useContext(ProductDetailContext)
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate()
    let minPrice = 0
    let maxPrice = 0
    let minPriceDis = 0
    let maxPriceDis = 0

    const handleSendMessage = () => {
        const data = {
            userId: userId,
            shopId: product.shopId
        }
        navigate('/chatBox', { state: { data: data } })
    }

    const GridItems = ({ productVariants, handleSelectProductVariant }) => (
        <div className={cx('grid-container')}>
            {productVariants ? (
                productVariants.map((item) =>
                    <div className={cx('grid-item')} key={item.productVariantId}>
                        {item.quantity > 0 ? (<Button onClick={() => handleSelectProductVariant(item)}>{item.name}</Button>) :
                            (<Button disabled onClick={() => handleSelectProductVariant(item)}>{item.name}</Button>)}

                    </div>)
            ) : (
                <Spin />
            )}
        </div>
    )

    const PriceFormat = ({ price }) => {
        const formattedPrice = formatPrice(price);
        return formattedPrice;
    }

    useEffect(() => {
        setQuantity(1)
    }, [handleSelectProductVariant])

    const discountPrice = (price, discount) => {
        const result = price * discount / 100
        return (price - result)
    }

    const rangePrice = (productVariants) => {
        const prices = productVariants?.map(variant => variant.price);
        return [Math.min(...prices), Math.max(...prices)]
    }


    if (product) {
        minPrice = rangePrice(product.productVariants)[0];
        maxPrice = rangePrice(product.productVariants)[1];
        minPriceDis = discountPrice(minPrice, product.discount);
        maxPriceDis = discountPrice(maxPrice, product.discount);
    }

    const handleChangeQuantity = (value) => {
        setQuantity(value)
    }

    const ProductMedias = ({ productMedias }) => {
        return (
            <Carousel autoplay>
                {

                    productMedias.map((item, index) => (
                        <div style={{ borderRadius: 10 }} key={index}>
                            <Image style={{ borderRadius: 10 }}
                                src={item.url}
                            />
                        </div>
                    ))
                }
            </Carousel>
        )
    }


    return (
        <Row>
            {product ? (<>
                <Col span={10}
                    style={{ padding: 10 }}
                >
                    <div id="image-product">
                        <ProductMedias productMedias={product.productMedias} />
                    </div>
                </Col>
                <Col span={14}
                    style={{ padding: 15 }}
                >
                    <div>
                        <Title level={3}>{product.productName}</Title>
                        <div className={cx('space-div-flex')}>
                            {productVariantsSelected ? (
                                <Title level={4}><PriceFormat price={productVariantsSelected.price} /></Title>
                            ) : (
                                <Title level={4}>{<PriceFormat price={minPrice} />} - {<PriceFormat price={maxPrice} />}</Title>
                            )}
                        </div>
                        <div
                            className={cx('space-div-flex')}
                        >
                            {productVariantsSelected ? (
                                <Text delete strong type="secondary"
                                    style={{ fontSize: 15 }}
                                >{<PriceFormat price={discountPrice(productVariantsSelected.price, product.discount)} />}</Text>
                            ) : (
                                <Text delete strong type="secondary"
                                    style={{ fontSize: 15 }}
                                >
                                    {<PriceFormat price={minPriceDis} />} - {<PriceFormat price={maxPriceDis} />}
                                </Text>
                            )}
                            <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                        </div>
                        <Divider />
                        <div style={{ marginBottom: 20 }}>
                            <Title level={4}>Loại sản phẩm</Title>
                            <GridItems productVariants={productVariants} handleSelectProductVariant={handleSelectProductVariant} />
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

                        <div

                        >

                            <Button disabled={product.quantity > 0 ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                Mua ngay
                            </Button>
                            <Button disabled={product.quantity > 0 ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                Thêm vào giỏ
                            </Button>
                            {userId !== product.shopId ? (<Button className={cx('margin-element')} type="primary" shape="round" icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage}>
                                Nhắn tin
                            </Button>) : (<></>)}

                        </div>
                    </div>

                </Col>
            </>) : (<Skeleton active />)}
        </Row>
    )
}


const ProductDescription = () => {
    const { product } = useContext(ProductDetailContext);
    return (
        <Row
        >
            <Col span={5}>
                <Title level={4}>Chi tiết sản phẩm</Title>
            </Col>
            {
                product ? (<>

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
        <Card bordered={false} style={{ width: '42vh' }} bodyStyle={{ padding: 8 }}>
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



const ProductFeedback = ({ feedback }) => {
    const { product } = useContext(ProductDetailContext);

    const FormatFeedbackMedias = ({ feedbackMedias }) => (
        feedbackMedias?.map((item, index) => (
            <div style={{ padding: 5 }}>
                <Image
                    key={index}
                    width={70}
                    src={item.url}
                />
            </div>
        ))
    )

    return (
        <>
            <Row>
                <Col span={5}>
                    <Title level={4}>Đánh giá sản phẩm</Title>
                </Col>
            </Row>
            <div>
                {
                    product && feedback ? (
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                pageSize: 5,
                            }}
                            dataSource={feedback}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.user.email}
                                >
                                    <Row>
                                        <List.Item.Meta
                                            avatar={<Avatar size="large" src={item.user.avatar} />}
                                            title={
                                                <>
                                                    <Row><span style={{ fontSize: 14 }}>{item.user.email}</span></Row>
                                                    <Row><Rate disabled defaultValue={item.rate} style={{ fontSize: 12, width: '15vh' }} /></Row>
                                                </>

                                            }
                                            description={moment(item.updateAt).format('HH:mm - DD/MM')}
                                        />

                                    </Row>
                                    <Row style={{ marginLeft: '9vh', marginBottom: '2vh' }}>
                                        {item.content}
                                    </Row>
                                    <Row style={{ marginLeft: '8vh' }}>
                                        <FormatFeedbackMedias feedbackMedias={item.feedbackMedias} />
                                    </Row>

                                </List.Item>
                            )}
                        />
                    ) : (<Skeleton active />)
                }
            </div>
        </>
    )
}



const ProductDetail = () => {
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const initialProductId = 3;
    const [product, setProduct] = useState(null)
    const [productVariants, setProductVariants] = useState([])
    const [productVariantsSelected, setProductVariantsSelected] = useState(null)
    const [feedback, setFeedback] = useState([])

    const handleSelectProductVariant = (item) => {
        if (productVariantsSelected === item) {
            setProductVariantsSelected(null)
        } else {
            setProductVariantsSelected(item)
        }
    }

    useEffect(() => {
        const getDetailProduct = () => {
            getProductById(initialProductId)
                .then((response) => {
                    setProduct(response.data)
                    setProductVariants([...response.data.productVariants])
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }

        getDetailProduct();

        const getFeedbacks = () => {
            getFeedbackByProductId(initialProductId)
                .then((res) => {
                    setFeedback(res.data)
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }

        getFeedbacks();
    }, [])

    const initialDataContext = {
        userId,
        product
    }


    return (
        <>
            <ProductDetailContext.Provider value={initialDataContext}>
                <ProductVariantDetail
                    productVariants={productVariants}
                    handleSelectProductVariant={handleSelectProductVariant}
                    productVariantsSelected={productVariantsSelected} />
                <Divider />
                <ProductDescription />
                <Divider />
                <ProductSuggestions />
                <Divider />
                <ProductFeedback feedback={feedback} />
            </ProductDetailContext.Provider>
        </>
    )
}

export default ProductDetail

