import classNames from 'classnames/bind';
import { useAuthUser } from 'react-auth-kit';
import { addProductToCart } from '~/api/cart';
import { getProductById } from '~/api/product';
import styles from './ProductDetail.module.scss';
import { formatPrice, formatNumberToK } from '~/utils';
import { getFeedbackByProductId } from '~/api/feedback';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CarouselCustom from '~/components/Carousels/CarouselCustom';
import { CART_RESPONSE_CODE_INVALID_QUANTITY } from '~/constants';
import React, { useState, useEffect, createContext, useContext } from "react";
import { CreditCardOutlined, ShoppingCartOutlined, MessageOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { Col, Row, Image, Button, Typography, Divider, Spin, Skeleton, Avatar, List, Rate, InputNumber, notification, Modal, Radio, Card, Carousel } from 'antd';

const cx = classNames.bind(styles);
const { Title, Text } = Typography;
const ProductDetailContext = createContext()
const moment = require('moment');
require('moment/locale/vi');

const ModelNotifyQuantity = ({ isModalNotifyQuantityOpen, handleOk, content }) => (
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
        <p>{content}</p>
    </Modal>
)


const ProductVariantDetail = ({ productVariants, handleSelectProductVariant, productVariantsSelected }) => {
    const auth = useAuthUser();
    const userId = auth()?.id;

    const {
        product,
        openNotification
    } = useContext(ProductDetailContext)
    const [quantity, setQuantity] = useState(1);
    const [isModalNotifyQuantityOpen, setIsModalNotifyQuantityOpen] = useState(false);
    const [contentProductInvalidQuantity, setContentProductInvalidQuantity] = useState('')

    const navigate = useNavigate()
    let minPrice = 0
    let maxPrice = 0
    let minPriceDis = 0
    let maxPriceDis = 0

    const handleSendMessage = () => {
        if (userId === undefined) {
            navigate('/login')
            return;
        } else {
            const data = {
                userId: userId,
                shopId: product.shop.shopId
            }
            navigate('/chatBox', { state: { data: data } })
        }
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
                        <Button disabled={item.quantity > 0 ? false : true} type={productVariantsSelected ? (productVariantsSelected === item ? 'primary' : 'default') : ('default')} onClick={() => handleSelectProductVariant(item)}>{item.name}</Button>
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

    const carouselStyle = { width: '100%', height: '50vh' };

    const ProductMedias = ({ productMedias }) => {
        return (
            <CarouselCustom
                data={productMedias}
                style={carouselStyle}
            />
        )
    }

    const handleAddProductToCart = async (isBuyNow) => {
        if (userId === undefined) {
            navigate('/login')
            return;
        }
        if (!productVariantsSelected) {
            openNotification("error", "Vui lòng chọn loại sản phẩm")
            return;
        }

        const dataAddToCart = {
            userId: userId,
            productVariantId: productVariantsSelected.productVariantId,
            quantity: quantity
        }

        addProductToCart(dataAddToCart)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    if (data.responseCode === CART_RESPONSE_CODE_INVALID_QUANTITY && data.ok === false) {
                        const message = `Sản phẩm này đang có số lượng ${data.message} trong giỏ hàng của bạn,
                        không thể thêm số lượng đã chọn vào giỏ hàng vì đã vượt quá số lượng sản phẩm có sẵn`

                        setContentProductInvalidQuantity(message);
                        showModalNotifyQuantity();
                    } else {
                        if (!isBuyNow) {
                            openNotification("success", "Sản phẩm đã được thêm vào trong giỏ hàng của bạn")
                        } else {
                            navigate('/cart')
                        }
                    }
                }
            })
            .catch((errors) => {
                console.log(errors)
                openNotification("error", "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!")
            })
    }


    return (
        <Card>
            <Row>
                {product ? (<>
                    <Col span={11}
                        style={{ padding: 15 }}
                    >
                        <ProductMedias productMedias={product.productMedias} />
                    </Col>
                    <Col span={13}
                        style={{ padding: 15 }}
                    >
                        <div>
                            <Title level={3}>{product.productName}</Title>
                            <div className={cx('space-div-flex')}>
                                {productVariantsSelected ? (
                                    <Title level={4}><PriceFormat price={productVariantsSelected.price} /></Title>
                                ) : (
                                    <>
                                        {
                                            product.productVariants.length > 1 ? (<Title level={4}>{<PriceFormat price={minPrice} />} - {<PriceFormat price={maxPrice} />}</Title>)
                                                : (product.productVariants.length === 1 ? <Title level={4}>{<PriceFormat price={product.productVariants[0].price} />}</Title> : <></>)
                                        }
                                    </>
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

                                    <>
                                        {
                                            product.productVariants.length > 1 ? (<Text delete strong type="secondary"
                                                style={{ fontSize: 15 }}
                                            >
                                                {<PriceFormat price={minPriceDis} />} - {<PriceFormat price={maxPriceDis} />}
                                            </Text>)
                                                : (product.productVariants.length === 1 ? <Text delete>{<PriceFormat price={discountPrice(product.productVariants[0].price, product.discount)} />}</Text> : <></>)
                                        }
                                    </>

                                )}
                                <div className={cx('red-box')}><p className={cx('text-discount')}>-{product.discount}%</p></div>
                            </div>
                            <Divider />
                            <div style={{ marginBottom: 20 }}>
                                <Title level={4}>Loại sản phẩm</Title>
                                <Radio.Group>
                                    <GridItems productVariants={productVariants} handleSelectProductVariant={handleSelectProductVariant} />
                                </Radio.Group>
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
                                <Button name="btnBuyNow" onClick={() => handleAddProductToCart(true)} disabled={product.quantity <= 0 || userId === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                    Mua ngay
                                </Button>
                                <Button name="btnAddToCart" onClick={() => handleAddProductToCart(false)} disabled={product.quantity <= 0 || userId === product.shop.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                    Thêm vào giỏ
                                </Button>
                                <Button disabled={userId !== product.shop.shopId ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage}>
                                    Nhắn tin
                                </Button>
                            </div>
                        </div>

                    </Col>
                    <ModelNotifyQuantity isModalNotifyQuantityOpen={isModalNotifyQuantityOpen} handleOk={handleOk} content={contentProductInvalidQuantity} />
                </>) : (<Skeleton active />)}
            </Row>
        </Card>
    )
}


const ProductDescription = () => {
    const { product } = useContext(ProductDetailContext);
    return (
        <Card>
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
        </Card>
    )
}


const ProductFeedback = ({ feedback }) => {
    const { product } = useContext(ProductDetailContext);

    const FormatFeedbackMedias = ({ feedbackMedias }) => (
        feedbackMedias?.map((item, index) => (
            <div style={{ padding: 5 }} key={index}>
                <Image
                    width={70}
                    src={item.url}
                />
            </div>
        ))
    )

    return (
        <Card>
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
        </Card>
    )
}


const ShopInfomations = ({ product }) => {

    const styleFirstCard = {
        borderRadius: '6px 0 0 6px'
    }

    const styleLastCard = {
        borderRadius: '0 6px 6px 0'
    }


    return (<>
        {
            product ? (

                <Row>
                    <Col span={7}>
                        <Card style={styleFirstCard}>
                            <Row>
                                <Col className={cx('flex-item-center')}>
                                    <Avatar size={64} icon={<UserOutlined />} />
                                </Col>
                                <Col className={cx('padding-left-element')}>
                                    <Link><Title level={4}>{product.shop.shopName}</Title></Link>
                                    <Button icon={<ShopOutlined />} type="primary" danger ghost>Xem Shop</Button>
                                    <Button icon={<MessageOutlined />} style={{ marginLeft: 10 }}>Chat ngay</Button>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Đánh giá</Title>
                            <Link><Text type="danger">{formatNumberToK(product.shop.feedbackNumber)}</Text></Link>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Sản phẩm</Title>
                            <Link><Text type="danger">{formatNumberToK(product.shop.productNumber)}</Text></Link>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} style={styleLastCard} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Tham gia</Title>
                            <Text type="danger">{moment(product.shop.dateCreate).fromNow()}</Text>
                        </Card>
                    </Col>


                    {/* <Col span={4} offset={1} className={cx('space-col-shop-info')}>
                        <Card>
                            <Text>Tham gia</Text>
                            <Link><Text type="danger" style={{ marginLeft: 20 }}>{moment(product.shop.dateCreate).fromNow()}</Text></Link>
                        </Card>
                    </Col>
                    <Col span={4} offset={1} className={cx('space-col-shop-info')}>
                        <Text>Sản phẩm</Text>
                        <Link><Text type="danger" style={{ marginLeft: 20 }}>{formatNumberToK(product.shop.productNumber)}</Text></Link>
                    </Col>
                    <Col span={4} offset={1} className={cx('space-col-shop-info')}>
                        <Text>Tham gia</Text>
                        <Link><Text type="danger" style={{ marginLeft: 20 }}>{moment(product.shop.dateCreate).fromNow()}</Text></Link>
                    </Col> */}
                </Row>

            ) : (
                <Skeleton active />
            )
        }

    </>)

}



const ProductDetail = () => {
    const { id } = useParams();
    const initialProductId = id;
    const [product, setProduct] = useState(null)
    const [productVariants, setProductVariants] = useState([])
    const [productVariantsSelected, setProductVariantsSelected] = useState(null)
    const [feedback, setFeedback] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate()

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
                    const data = response.data;
                    if (!data) {
                        navigate('/notFound');
                    }
                    setProduct(data)
                    console.log('data: ' + JSON.stringify(data))
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initialDataContext = {
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
                <ShopInfomations product={product} />
                <ProductDescription />
                <ProductFeedback feedback={feedback} />
            </ProductDetailContext.Provider>
        </>
    )
}

export default ProductDetail

