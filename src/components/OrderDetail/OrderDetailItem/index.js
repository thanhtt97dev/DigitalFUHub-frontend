import { Button, Col, Descriptions, Image, Rate, Row, Space, Tooltip, Typography } from "antd";
import { memo } from "react";
import { Link } from "react-router-dom";
import { ORDER_CONFIRMED } from "~/constants";
import { formatPrice } from "~/utils";
const { Text, Title } = Typography;
function OrderDetailItem({ orderDetail, statusId, handleFeedbackOrder = () => { } }) {
    return (<>
        <Col span={24}>
            <Row gutter={[8, 8]}>
                <Col flex={0}>
                    <Link to={`/product/${orderDetail.productId}`}>
                        <Image
                            width={90}
                            height={90}
                            src={orderDetail.thumbnail}
                            preview={false}
                        />
                    </Link>
                </Col>
                <Col flex={5}>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={17}>
                                    <Link to={`/product/${orderDetail.productId}`}>
                                        <Title level={5} style={{ marginBottom: 0 }}>
                                            {orderDetail.productName.length > 70 ? <Tooltip title={orderDetail.productName}>{orderDetail.productName.slice(0, 70)}...</Tooltip> : orderDetail.productName}
                                        </Title>
                                    </Link>
                                </Col>
                                {!orderDetail.isFeedback && statusId === ORDER_CONFIRMED && <Col offset={1} span={6}>
                                    <Row justify="end">
                                        <Button type="primary" size="small" onClick={handleFeedbackOrder}>Đánh giá</Button>
                                    </Row>
                                </Col>}
                                {orderDetail.isFeedback && <Col offset={1} span={6}>
                                    <Row justify="end" gutter={[8, 0]}>
                                        <Col>
                                            <Text>Đánh giá</Text>
                                        </Col>
                                        <Col>
                                            <Rate style={{
                                                fontSize: '14px',
                                                lineHeight: '1.2',
                                            }} disabled value={orderDetail.feebackRate} />
                                        </Col>
                                    </Row>
                                </Col>}
                            </Row>
                        </Col>
                        <Col span={24}><Text>{`Phân loại hàng: ${orderDetail.productVariantName}`}</Text></Col>
                        <Col span={24}>
                            <Row>
                                <Col span={1}>
                                    <Text>{`x${orderDetail.quantity}`}</Text>
                                </Col>
                                <Col span={23}>
                                    <Row justify="end">
                                        {orderDetail.discount === 0 ?
                                            <Text>{formatPrice(orderDetail.price)}</Text>
                                            :
                                            <Space size={[8, 0]}>
                                                <Text delete>{formatPrice(orderDetail.price)}</Text>
                                                <Text>{formatPrice(orderDetail.price - (orderDetail.price * orderDetail.discount / 100))}</Text>
                                            </Space>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify='end'>
                        <Col span={24}>
                            <Descriptions bordered items={[
                                {
                                    key: '1',
                                    label: 'Thông tin tài khoản',
                                    labelStyle: { 'text-align': 'right', width: '30%', fontWeight: 'bold' },
                                    span: '3',
                                    children: orderDetail?.assetInformations?.map((v, i) => (<><Text key={i}>{v}</Text><br /></>))
                                },
                            ]} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    </>);
}

export default memo(OrderDetailItem);