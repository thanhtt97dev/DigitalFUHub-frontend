import React, { useEffect, useState } from 'react'
import { Button, message, Steps, theme, Row, Col, Image, Typography, InputNumber, Modal, notification, Checkbox } from 'antd';
import { useAuthUser } from 'react-auth-kit';
import { Card } from 'antd';
import { getCartsByUserId } from '~/api/cart';

const { Title, Text } = Typography;


const CartItem = ({ item, setProductVariantsIdSelected, showModal }) => (
    <Card title={item.shopName}>
        <Row>
            <Col><Checkbox>
                <Image
                    width={200}
                    src={item.thumbnail}
                /></Checkbox></Col>
            <Col offset={1}><Title level={5}>{item.productName}</Title></Col>
            <Col offset={1}><Text type="secondary">Variant: {item.productVariantName}</Text></Col>
            <Col offset={1}><Text>{item.price}</Text></Col>
            <Col offset={1}><Text>{item.price}</Text></Col>
            <Col offset={1}><InputNumber min={1} defaultValue={item.quantity} /></Col>
            <Col offset={1}><Button onClick={() => { setProductVariantsIdSelected(item.productVariantId); showModal() }}>Delete</Button></Col>
        </Row>

    </Card>
)

const Carts = ({ carts, updateCarts, openNotification }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productVariantsIdSelected, setProductVariantsIdSelected] = useState(0);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        const newCarts = carts.filter(c => c.productVariantId !== productVariantsIdSelected)
        updateCarts(newCarts)
        openNotification("success", "Xóa sản phẩm thành công")
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (<>
        <Row>
            <Col span={19}>
                {
                    carts.map((item, index) => (<>
                        <CartItem
                            key={index}
                            item={item}
                            setProductVariantsIdSelected={setProductVariantsIdSelected}
                            showModal={showModal} />
                    </>))
                }
            </Col>
            <Col span={15}>
            </Col>
        </Row>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
        </Modal>
    </>



    )
}


const Cart = () => {
    const auth = useAuthUser();
    const user = auth();
    const userId = user.id;
    const [carts, setCarts] = useState([])
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [api, contextHolder] = notification.useNotification();

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
            content: <Carts carts={carts} updateCarts={updateCarts} openNotification={openNotification} />,
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

    }, [userId])

    return (
        <>
            {contextHolder}
            <Steps current={current} items={items} />

            <div style={contentStyle}>
                {steps[current].content}
            </div>

            <div
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
            </div>
        </>
    )
}

export default Cart