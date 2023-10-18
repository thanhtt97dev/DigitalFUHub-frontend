import {
    ShopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row, Space, Tag, Tooltip, Typography } from "antd";
import { Link } from "react-router-dom";
import { ChatIcon } from "~/components/Icon";
import { ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { formatStringToCurrencyVND } from "~/utils";

const { Text, Title } = Typography;

function CardOrderItem({
    orderId,
    note,
    orderDate,
    shopId,
    shopName,
    statusId,
    totalAmount,
    totalCoinDiscount,
    totalCouponDiscount,
    totalPayment,
    orderDetails,
    onOrderComplete = () => { },
    onOrderComplaint = () => { }
}) {

    const getButtonsStatus = () => {
        if (statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button danger onClick={onOrderComplaint}>Khiếu nại</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={onOrderComplete}>Xác nhận</Button>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn thành</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ fontSize: 14, height: 32, lineHeight: 2.2 }} color="warning">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={onOrderComplete}>Xác nhận</Button>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} color="processing" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đang tranh chấp</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="red" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Từ chối khiếu nại</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_SELLER_REFUNDED || statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        }
    }
    return <Card
        title={<Row gutter={[8, 0]} align="bottom">
            <Col>
                <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
                {/* <ShopOutlined style={{ fontSize: '18px' }} /> */}
            </Col>
            <Col>
                <Title level={5}>{shopName}</Title>
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
            {orderDetails.map((v, i) => {
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
                                    <Title level={5}>
                                        {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.substring(0, 70)}...</Tooltip> : v.productName}
                                    </Title>
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
                        {!v.isFeedback && <Col span={24}>
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
                    <Col span={24}>
                        <Row justify="end">
                            <Col style={{ textAlign: 'right' }}><Title level={5}>Thành tiền:</Title></Col>
                            <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                <Text>{`${formatStringToCurrencyVND(totalPayment)}đ`}</Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Col>
            <Col span={24}>
                {getButtonsStatus()}
            </Col>
        </Row>

    </Card>;
}

export default CardOrderItem;