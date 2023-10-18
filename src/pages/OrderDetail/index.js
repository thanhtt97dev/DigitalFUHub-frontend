import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { customerUpdateStatusOrder, getOrderDetailCustomer } from "~/api/order";
import { ParseDateTime, getUserId, formatStringToCurrencyVND } from "~/utils";
import {
    ShopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
    LeftOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Rate, Row, Space, Typography, Tag, Tooltip } from "antd";
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import { ChatIcon } from "~/components/Icon";

const { Text, Title } = Typography;
function OrderDetail() {
    const notification = useContext(NotificationContext);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    useEffect(() => {
        getOrderDetailCustomer(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                } else {
                    return navigate("/history/order");
                }
            })
            .catch((err) => {
                return navigate("/history/order");
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleOrderComplaint = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: 3
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        order.statusId = dataBody.statusId
                        return { ...prev }
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => {
                notification("error", "Thất bại", "Đã có lỗi xảy ra.")
            })
    }

    const handleOrderComplete = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: 2
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        order.statusId = dataBody.statusId
                        return { ...prev }
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => { notification("error", "Thất bại", "Đã có lỗi xảy ra.") })
    }
    const getTextStatusOrder = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Text>Chờ xác nhận</Text>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Text>Đã xác nhận</Text>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Text>Đang khiếu nại</Text>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Text>Đang tranh chấp</Text>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Text>Từ chối khiếu nại</Text>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED || order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Text>Hoàn trả tiền</Text>
        }
    }
    const getButtonsStatus = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button danger onClick={handleOrderComplaint}>Khiếu nại</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleOrderComplete}>Xác nhận</Button>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn thành</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ fontSize: 14, height: 32, lineHeight: 2.2 }} color="warning">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleOrderComplete}>Xác nhận</Button>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} color="processing" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đang tranh chấp</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="red" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Từ chối khiếu nại</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED || order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
                </Col>

            </Row>
        }
    }
    return (<Card
        title={
            <Row>
                <Col span={2}>
                    <Link to={"/history/order"}><LeftOutlined />Trở lại</Link>
                </Col>
                <Col span={22}>
                    <Row justify="end" gutter={[16, 0]}>
                        <Col><Text>Mã đơn hàng: #{order?.orderId}</Text></Col>
                        <Col>|</Col>
                        <Col><Text>Ngày đặt hàng: {ParseDateTime(order?.orderDate)}</Text></Col>
                        <Col>|</Col>
                        <Col><Text>{getTextStatusOrder()}</Text></Col>
                    </Row>
                </Col>
            </Row>
        }
    >
        <Card
            title={<Row gutter={[8, 0]} align="bottom">
                <Col>
                    <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
                </Col>
                <Col>
                    <Title level={5}>{order.shopName}</Title>
                </Col>
                <Col>
                    <Title level={5}>
                        <Button
                            type="default"
                            size="small"
                            icon={<ShopOutlined />}
                        >
                            Xem cửa hàng
                        </Button></Title>
                </Col>
                <Col>
                    <Title level={5}>

                        <Button
                            type="default"
                            size="small"
                            icon={<ChatIcon />}
                        >
                            Nhắn tin
                        </Button></Title>
                </Col>
            </Row>}
            bordered={true}
        >
            <div>
                {order?.orderDetails?.map((v, i) => {
                    return (
                        <Row gutter={[8, 8]}>
                            <Col flex={0}>
                                <Link to={`/product/${v.productId}`}>
                                    <Image
                                        width={120}
                                        src={v.thumbnail}
                                        preview={false}
                                    />
                                </Link>
                            </Col>
                            <Col flex={5}>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={17}>
                                                <Title level={5}>
                                                    {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.substring(0, 70)}...</Tooltip> : v.productName}
                                                </Title>
                                            </Col>
                                            {v.isFeedback && <Col offset={1} span={6}>
                                                <Row justify="end" gutter={[6, 0]}>
                                                    <Col>
                                                        <Text>Đánh giá</Text>
                                                    </Col>
                                                    <Col>
                                                        <Rate style={{
                                                            fontSize: '16px',
                                                            lineHeight: '1.2',
                                                        }} disabled defaultValue={v.feedbackRate} />
                                                    </Col>
                                                </Row>
                                            </Col>}
                                        </Row>
                                    </Col>
                                    <Col span={24}><Text>{`Phân loại hàng: ${v.productVariantName}`}</Text></Col>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={1}>
                                                <Text>{`x${v.quantity}`}</Text>
                                            </Col>
                                            <Col span={23}>
                                                <Row justify="end">
                                                    {v.discount === 0 ?
                                                        <Text>{formatStringToCurrencyVND(v.price)}₫</Text>
                                                        :
                                                        <Space size={[8, 0]}>
                                                            <Text delete>{formatStringToCurrencyVND(v.price)}₫</Text>
                                                            <Text>{formatStringToCurrencyVND(v.price - (v.price * v.discount / 100))}₫</Text>
                                                        </Space>
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>


                                </Row>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Title level={5}>Dữ liệu sản phẩm:</Title>
                                    </Col>
                                    {v?.assetInformations?.map((v, i) => (<Col offset={1} span={23} key={i}>{v}</Col>))}
                                </Row>
                            </Col>
                            {!v.isFeedback && order.statusId === ORDER_CONFIRMED && <Col span={24}>
                                <Row justify="end">
                                    <Button type="primary">Đánh giá</Button>
                                </Row>
                            </Col>}
                        </Row>
                    )
                })}
            </div>
            <Divider />
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Row justify="end">
                        {order?.totalAmount !== 0 && <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Tổng tiền:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>{formatStringToCurrencyVND(order?.totalAmount)}₫</Text>
                                </Col>
                            </Row>
                        </Col>}

                        {order?.totalCouponDiscount !== 0 && <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Mã giảm giá:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>-{formatStringToCurrencyVND(order?.totalCouponDiscount)}₫</Text>
                                </Col>
                            </Row>
                        </Col>}
                        {order?.totalCoinDiscount !== 0 && <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Xu:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>-{formatStringToCurrencyVND(order?.totalCoinDiscount)}₫</Text>
                                </Col>
                            </Row>
                        </Col>}
                        <Col span={24}>
                            <Row justify="end">
                                <Col span={5}>
                                    <Divider />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Thành tiền:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>{`${formatStringToCurrencyVND(order.totalPayment)}₫`}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>
                <Col span={24}>
                    {getButtonsStatus()}
                </Col>
            </Row>
            <Divider />
        </Card>
    </Card>);
}

export default OrderDetail;