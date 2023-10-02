import React, { useEffect, useState } from 'react'
import {
    Button, message, Steps, theme, Row, Col,
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


// const CartItem = ({ item, setProductVariantsIdSelected, showModal }) => (
//     <Card title={item.shopName}>
//         <Row>
//             <Col>
//                 <Checkbox value={item.price}></Checkbox>
//                 <Image
//                     width={100}
//                     src={item.product.thumbnail}
//                 />
//             </Col>
//             <Col offset={1}><Title level={5}>{item.product.productName}</Title></Col>
//             <Col offset={1}><Text type="secondary">Variant: {item.productVariantName}</Text></Col>
//             <Col offset={1}><Text>{item.priceDiscount}</Text></Col>
//             <Col offset={1}><InputNumber min={1} defaultValue={item.quantity} /></Col>
//             <Col offset={1}><Text>{item.price}</Text></Col>
//             <Col offset={1}><Button onClick={() => { setProductVariantsIdSelected(item.productVariantId); showModal() }}>Delete</Button></Col>
//         </Row>

//     </Card>
// )

const Carts = ({ carts, updateCarts, openNotification, setTotalPrice, totalPrice, balance }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        const newCarts = carts.filter(c => c.productVariantId !== productVariantsIdSelected)
        deleteCart({ userId: newCarts.userId, productVariantId: newCarts.productVariantId })
            .then((res) => {
                if (res.data.ok === true) {
                    console.log('res.data = ' + JSON.stringify(res.data));
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
                                        <Col offset={1}><Button onClick={() => { setProductVariantsIdSelected(item.productVariantId); showModal() }}>Delete</Button></Col>
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
                        <div className={cx('space-div-flex')}>
                            <Text>Số dư hiện tại:</Text>
                            <Text strong>{balance}</Text>
                        </div>
                        <div className={cx('space-div-flex')}>
                            <Text>Số tiền cần nạp thêm:</Text>
                            <Text strong>{totalPrice.discountPrice - balance}</Text>
                        </div>
                        <Button type="primary" block>
                            Nạp thêm vào tài khoản
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
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
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
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

    const steps = [
        {
            title: 'Giỏ hàng',
            content: <Carts
                carts={carts}
                updateCarts={updateCarts}
                openNotification={openNotification}
                setTotalPrice={setTotalPrice}
                totalPrice={totalPrice}
                balance={balance} />,
        },
        {
            title: 'Xác nhận',
            content: 'Second-content',
        },
        {
            title: 'Thanh toán',
            content: 'Last-content',
        },
    ];
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

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
            <Steps current={current} items={items} />

            <div style={contentStyle}>
                {steps[current].content}
            </div>

            {/* <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Previous
                    </Button>
                )}
            </div> */}
        </>
    )
}

export default Cart