import React, { useState, useEffect, createContext, useContext } from "react"
import { getUserId } from '~/utils';
import {
    Col, Row, Image, Button, Typography, Divider, Spin, Skeleton,
    Avatar, List, Rate, InputNumber, Carousel, notification, Modal,
    Radio
} from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import {
    CreditCardOutlined,
    ShoppingCartOutlined, MessageOutlined,
} from '@ant-design/icons';
import { getProductById } from '~/api/product';
import { addProductToCart } from '~/api/cart';
import { getFeedbackByProductId } from '~/api/feedback';
import { formatPrice } from '~/utils'
import { useNavigate, useParams, Link } from 'react-router-dom';
import moment from 'moment'
import { CART_RESPONSE_CODE_INVALID_QUANTITY } from '~/constants'

const cx = classNames.bind(styles);
const { Title, Text } = Typography;
const ProductDetailContext = createContext()

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
    const userId = getUserId();
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
        const userId = getUserId();
        if (!userId) {
            navigate('/login')
        }
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


    const imageStyle = {
        height: '50vh',
        borderRadius: 5
    };


    const ProductMedias = ({ productMedias }) => {
        return (
            <Carousel autoplay style={{ width: '100%', height: '50vh' }}>
                {
                    productMedias.map((item, index) => (
                        <div id="container-image" key={index} >
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <Image
                                    style={imageStyle}
                                    src={item.url}
                                />
                            </div>
                        </div>
                    ))
                }
            </Carousel >
        )
    }

    const handleAddProductToCart = async (isBuyNow) => {
        const userId = getUserId();
        if (!userId) {
            navigate('/login')
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
                        setContentProductInvalidQuantity(data.message);
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
        <Row>
            {product ? (<>
                <Col span={10}
                    style={{ padding: 10 }}
                >
                    <ProductMedias productMedias={product.productMedias} />
                </Col>
                <Col span={14}
                    style={{ padding: 15 }}
                >
                    <div>
                        <Title level={3}>{product.productName}</Title>
                        <Divider />
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
                        <div className={cx('space-div-flex')}>
                            <Text>Tên shop:</Text>
                            <Button type="link">{product.shopName}</Button>
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
                            {
                                userId ? (<>
                                    <Button name="btnBuyNow" onClick={() => handleAddProductToCart(true)} disabled={product.quantity <= 0 || userId === product.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<CreditCardOutlined />} size={'large'}>
                                        Mua ngay
                                    </Button>
                                    <Button name="btnAddToCart" onClick={() => handleAddProductToCart(false)} disabled={product.quantity <= 0 || userId === product.shopId ? true : false} className={cx('margin-element')} type="primary" shape="round" icon={<ShoppingCartOutlined />} size={'large'}>
                                        Thêm vào giỏ
                                    </Button>
                                    <Button disabled={userId !== product.shopId ? false : true} className={cx('margin-element')} type="primary" shape="round" icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage}>
                                        Nhắn tin
                                    </Button>
                                </>) : (<>
                                    <Title level={5} className={cx('margin-element')}>Vui lòng đăng nhập để mua hàng, hoặc liên lạc với chủ shop.</Title>
                                    <Link to={'/Login'}>
                                        <Button type="primary" className={cx("button", "margin-element")}>Đăng nhập</Button>
                                    </Link>
                                </>)
                            }
                        </div>
                    </div>

                </Col>
                <ModelNotifyQuantity isModalNotifyQuantityOpen={isModalNotifyQuantityOpen} handleOk={handleOk} content={contentProductInvalidQuantity} />
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
                    debugger
                    if (!data) {
                        navigate('/notFound');
                    }
                    setProduct(data)
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
                <Divider />
                <ProductDescription />
                <Divider />
                <Divider />
                <ProductFeedback feedback={feedback} />
            </ProductDetailContext.Provider>
        </>
    )
}

export default ProductDetail

