import React, { useState, useEffect, createContext, useContext } from "react"
import { useAuthUser } from 'react-auth-kit';
import {
    Col, Row, Image, Button, Typography, Divider, Spin, Skeleton, Card,
    Avatar, List, Rate, InputNumber, Carousel, notification, Modal
} from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import {
    CreditCardOutlined,
    ShoppingCartOutlined, MessageOutlined,
} from '@ant-design/icons';
import { getProductById } from '~/api/product';
import { addProductToCart, getCart } from '~/api/cart';
import { getFeedbackByProductId } from '~/api/feedback';
import { formatPrice } from '~/utils'
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment'

const cx = classNames.bind(styles);
const { Title, Text } = Typography;
const ProductDetailContext = createContext()

const ModelNotifyQuantity = ({ isModalNotifyQuantityOpen, handleOk, quantity }) => (
    <Modal
        open={isModalNotifyQuantityOpen}
        closable={false}
        maskClosable={false}
        footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
                OK
            </Button>,

        ]}
    >
        <p>Sản phẩm này đang có số lượng <strong>{quantity}</strong> trong giỏ hàng của bạn</p>
        <p>Không thể thêm số lượng đã chọn vào giỏ hàng vì đã vượt quá số lượng sản phẩm có sẵn</p>
    </Modal>
)


const ProductVariantDetail = ({ productVariants, handleSelectProductVariant, productVariantsSelected }) => {
    const {
        userId,
        product,
        openNotification
    } = useContext(ProductDetailContext)
    const [quantity, setQuantity] = useState(1);
    const [quantityProductSelectedInCart, setquantityProductSelectedInCart] = useState(0);
    const [isModalNotifyQuantityOpen, setIsModalNotifyQuantityOpen] = useState(false);

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

    const showModalNotifyQuantity = () => {
        setIsModalNotifyQuantityOpen(true);
    };
    const handleOk = () => {
        setIsModalNotifyQuantityOpen(false);
    };

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

    const handleAddProductToCart = async (isBuyNow) => {
        if (!productVariantsSelected) {
            openNotification("error", "Vui lòng chọn loại sản phẩm")
            return;
        }

        getCart(userId, productVariantsSelected.productVariantId)
            .then((res) => {
                if (res.data) {
                    const cart = res.data;
                    const quantityPurchased = quantity + cart.quantity
                    if (quantityPurchased > productVariantsSelected.quantity) {
                        setquantityProductSelectedInCart(cart.quantity)
                        showModalNotifyQuantity()
                    } else {
                        funcAddProductToCart(isBuyNow);
                    }
                } else {
                    funcAddProductToCart(isBuyNow);
                }
            }).catch((errors => {
                console.log(errors)
            }))
    }

    const funcAddProductToCart = (isBuyNow) => {
        const dataAddToCart = {
            userId: userId,
            productVariantId: productVariantsSelected.productVariantId,
            quantity: quantity
        }


        addProductToCart(dataAddToCart)
            .then((res) => {
                if (res.status === 200) {
                    if (!isBuyNow) {
                        openNotification("success", "Sản phẩm đã được thêm vào trong giỏ hàng của bạn")
                    } else {
                        navigate('/cart')
                    }
                }
            })
            .catch((errors) => {
                console.log(errors)
                openNotification("error", "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!")
            })

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

                            <Button name="btnBuyNow" onClick={() => handleAddProductToCart(true)} disabled={product.quantity > 0 ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                Mua ngay
                            </Button>
                            <Button name="btnAddToCart" onClick={() => handleAddProductToCart(false)} disabled={product.quantity > 0 ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                Thêm vào giỏ
                            </Button>
                            {userId !== product.shopId ? (<Button className={cx('margin-element')} type="primary" shape="round" icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage}>
                                Nhắn tin
                            </Button>) : (<></>)}

                        </div>
                    </div>

                </Col>
                <ModelNotifyQuantity isModalNotifyQuantityOpen={isModalNotifyQuantityOpen} handleOk={handleOk} quantity={quantityProductSelectedInCart} />
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
                    <Col span={23}
                        offset={1}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
    const { id } = useParams();
    const initialProductId = id;
    const [product, setProduct] = useState(null)
    const [productVariants, setProductVariants] = useState([])
    const [productVariantsSelected, setProductVariantsSelected] = useState(null)
    const [feedback, setFeedback] = useState([])
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

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
        product,
        openNotification
    }


    return (
        <>
            {contextHolder}
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

