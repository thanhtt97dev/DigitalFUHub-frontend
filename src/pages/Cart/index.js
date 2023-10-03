import React, { useEffect, useState } from 'react'
import {
    Button, Row, Col,
    Image, Typography, InputNumber, Modal,
    notification, Checkbox, Divider
} from 'antd';
import { useAuthUser } from 'react-auth-kit';
import { Card } from 'antd';
import { getCartsByUserId, deleteCart } from '~/api/cart';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { formatPrice } from '~/utils';
import { getCustomerBalance } from '~/api/user';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);


const Carts = ({ carts, updateCarts, openNotification, setTotalPrice, totalPrice, balance }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalBuyOpen, setIsModalBuyOpen] = useState(false);
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModalBuy = () => {
        setIsModalBuyOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        const newCarts = carts.filter(c => c.productVariantId !== productVariantsIdSelected)

        const dataDelete = {
            userId: newCarts[0].userId,
            productVariantId: newCarts[0].productVariantId
        }

        deleteCart(dataDelete)
            .then((res) => {
                if (res.data.ok === true) {
                    updateCarts(newCarts)
                    openNotification("success", "Xóa sản phẩm thành công")
                } else {
                    openNotification("error", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
                }
            })
            .catch((errors) => {
                console.log(errors)
                openNotification("error", "Có lỗi trong quá trình xóa, vui lòng thử lại sau")
            })
    };


    const handleBuyOk = () => {
        setIsModalBuyOpen(false);

    }


    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleOnChangeCheckbox = (values) => {
        const cartFilter = carts.filter(c => values.includes(c.productVariantId))

        const totalOriginPrice = cartFilter.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.productVariant.price;
        }, 0);

        const totalDiscountPrice = cartFilter.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.productVariant.priceDiscount;
        }, 0);


        setTotalPrice({ originPrice: totalOriginPrice, discountPrice: totalDiscountPrice });
    }

    const handleBuy = () => {
        if (balance < totalPrice.discountPrice) {
            showModalBuy()
            return
        }
    }

    return (<>
        {carts.length > 0 ? (<>
            <Row>
                <Col span={18}>
                    <Checkbox.Group onChange={handleOnChangeCheckbox} style={{ display: 'block' }}>
                        {
                            carts.map((item, index) => (
                                <Card title={item.shopName} key={index}>
                                    <Row>
                                        <Col>
                                            <Checkbox value={item.productVariantId}></Checkbox>
                                            <Image
                                                width={100}
                                                src={item.product.thumbnail}
                                            />
                                        </Col>
                                        <Col offset={1}><Title level={5}>{item.product.productName}</Title></Col>
                                        <Col offset={1}><Text type="secondary">Variant: {item.productVariant.productVariantName}</Text></Col>
                                        <Col offset={1}><Text>{item.productVariant.priceDiscount}</Text></Col>
                                        <Col offset={1}><InputNumber min={1} max={item.productVariant.quantity} defaultValue={item.quantity} /></Col>
                                        <Col offset={1}><Text>{item.productVariant.price}</Text></Col>
                                        <Col offset={1}><Button onClick={() => { setProductVariantsIdSelected(item.productVariantId); showModal() }}>Xóa</Button></Col>
                                    </Row>

                                </Card>
                            ))
                        }
                    </Checkbox.Group>
                </Col>
                <Col span={6}>
                    <Card
                        style={{
                            width: '100%',
                            height: '70vh'
                        }}
                    >
                        <Title level={5} className={cx('space-div-flex')}>Thanh toán</Title>
                        <div className={cx('space-div-flex')}>
                            <Text>Tổng tiền hàng:</Text>
                            <Text strong>{totalPrice.originPrice}</Text>
                        </div>
                        <div className={cx('space-div-flex')}>
                            <Text>Giảm giá sản phẩm:</Text>
                            <Text strong>- {totalPrice.originPrice - totalPrice.discountPrice}</Text>
                        </div>
                        <Divider />
                        <div className={cx('space-div-flex')}>
                            <Text>Tổng giá trị phải thanh toán:</Text>
                            <Text strong>{totalPrice.discountPrice}</Text>
                        </div>
                        <Button type="primary" disabled={totalPrice.originPrice > 0 ? false : true} block onClick={handleBuy}>
                            Mua hàng
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
            </Modal>

            <Modal
                open={isModalBuyOpen}
                closable={false}
                maskClosable={false}
                footer={[
                    <Button key="submit" type="primary" onClick={handleBuyOk}>
                        OK
                    </Button>,

                ]}
            >
                <p>Số dư không đủ, vui lòng nạp thêm tiền vào tài khoản</p>
            </Modal>
        </>) : (<Title level={4}>Không có sản phẩm nào trong giỏ hàng</Title>)}

    </>



    )
}


const Cart = () => {
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const initialTotalPrice = {
        originPrice: 0,
        discountPrice: 0
    }
    const [carts, setCarts] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [balance, setBalance] = useState(0);

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const updateCarts = (cart) => {
        setCarts(cart);
    }


    useEffect(() => {
        getCartsByUserId(userId)
            .then((res) => {
                const data = res.data;
                setCarts(data)
            })
            .catch((errors) => {
                console.log(errors)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getCustomerBalance(userId)
            .then((res) => {
                if (balance !== res.data) {
                    setBalance(res.data)
                }
            }).catch((err) => {
                console.log(err.message)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {contextHolder}
            <Carts
                carts={carts}
                updateCarts={updateCarts}
                openNotification={openNotification}
                setTotalPrice={setTotalPrice}
                totalPrice={totalPrice}
                balance={balance} />
        </>
    )
}

export default Cart