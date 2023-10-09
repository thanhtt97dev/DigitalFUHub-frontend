import {
    ShopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { formatStringToCurrencyVND } from "~/utils";

const { Text, Title } = Typography;

function CardOrderItem({
    orderId,
    productName,
    productId,
    price,
    quantity,
    shopId,
    shopname,
    variantName,
    thumbnail,
    status,
    discount,
    couponDiscount,
    isFeedback }) {

    const getButtonsStatus = (statusId) => {
        if (statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button danger>Khiếu nại</Button>
                </Col>
                <Col>
                    <Button type="primary">Xác nhận</Button>
                </Col>
            </Row>
        } else if (statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn thành</Tag>
                </Col>
            </Row>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ fontSize: 14, height: 32, lineHeight: 2.2 }} color="warning">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary">Xác nhận</Button>
                </Col>
            </Row>
        } else if (statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} color="processing" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đang tranh chấp</Tag>
                </Col>
            </Row>
        } else if (statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="red" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Từ chối khiếu nại</Tag>
                </Col>
            </Row>
        } else if (statusId === ORDER_SELLER_REFUNDED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
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
                <Title level={5}>{shopname}</Title>
            </Col>
        </Row>}
        bordered={true}
    >
        <Link to={`/history/order/${orderId}`}>
            <Row gutter={[8, 8]}>
                <Col flex={0}>
                    <Image
                        width={100}
                        src={thumbnail}
                        preview={false}
                    />
                </Col>
                <Col flex={5}>
                    <Row>
                        <Col span={24}><Title level={5}>{productName}</Title></Col>
                        <Col span={24}><Text>{`Phân loại hàng: ${variantName}`}</Text></Col>
                        <Col span={24}>
                            <Row>
                                <Col span={1}>
                                    <Text>{`x${quantity}`}</Text>
                                </Col>
                                <Col span={23}>
                                    <Row justify="end">
                                        {discount === 0 ?
                                            <Text>{formatStringToCurrencyVND(price)} đ</Text>
                                            :
                                            <Space size={[8, 0]}>
                                                <Text delete>{formatStringToCurrencyVND(price)} đ</Text>
                                                <Text>{formatStringToCurrencyVND(price - (price * discount / 100))} đ</Text>
                                            </Space>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Link>
        <Divider />
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Row justify="end">
                    {/* {couponDiscount !== 0 && <Col span={24}>
                        <Row justify="end">
                            <Col style={{ textAlign: 'right' }}>Tổng tiền:</Col>
                            <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                <Text>{formatStringToCurrencyVND((price - (price * discount / 100)) * quantity)} đ</Text>
                            </Col>
                        </Row>
                    </Col>}

                    {couponDiscount !== 0 && <Col span={24}>
                        <Row justify="end">
                            <Col style={{ textAlign: 'right' }}>Áp mã giảm giá:</Col>
                            <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                <Text>-{(((price - (price * discount / 100)) * quantity) * couponDiscount / 100)} đ</Text>
                            </Col>
                        </Row>
                    </Col>} */}
                    <Col span={24}>
                        <Row justify="end">
                            <Col style={{ textAlign: 'right' }}>Thành tiền:</Col>
                            <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                <Text>{`${formatStringToCurrencyVND(((price - (price * discount / 100)) * quantity) - (((price - (price * discount / 100)) * quantity) * couponDiscount / 100))} đ`}</Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Col>
            <Col span={24}>
                {getButtonsStatus(status)}
            </Col>
        </Row>

    </Card>;
}

export default CardOrderItem;