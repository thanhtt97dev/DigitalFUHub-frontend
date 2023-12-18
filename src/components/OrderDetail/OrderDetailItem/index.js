import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Image, Rate, Row, Space, Tooltip, Typography } from "antd";
import { memo } from "react";
import { Link } from "react-router-dom";
import { LIMIT_TIME_TO_FEEDBACK, ORDER_CONFIRMED } from "~/constants";
import { formatPrice, getDistanceDayTwoDate } from "~/utils";
const { Text, Title } = Typography;
function OrderDetailItem({ dateConfirmed, orderDetail, statusId, hideAssetInformation, handleDisplayAssetInformation = () => { },
    handleHideAssetInformation = () => { }, handleFeedbackOrder = () => { } }) {
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
                                {!orderDetail.isFeedback && statusId === ORDER_CONFIRMED && dateConfirmed && getDistanceDayTwoDate(dateConfirmed, new Date()) <= LIMIT_TIME_TO_FEEDBACK && <Col offset={1} span={6}>
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
                                            }} disabled value={orderDetail.feedbackRate} />
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
                                            <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600' }}>{formatPrice(orderDetail.price)}</Text>
                                            :
                                            <Space size={[8, 0]}>
                                                <Text delete style={{ color: 'rgba(0, 0, 0, .4)' }}>{formatPrice(orderDetail.price)}</Text>
                                                <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600' }}>{formatPrice(orderDetail.price - (orderDetail.price * orderDetail.discount / 100))}</Text>
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
                                    label: <label>Thông tin tài khoản <Tooltip title={hideAssetInformation === true ? "Hiển thị" : "Ẩn"}>{hideAssetInformation === true ? <EyeOutlined style={{ cursor: 'pointer' }} onClick={handleDisplayAssetInformation} /> : <EyeInvisibleOutlined style={{ cursor: 'pointer' }} onClick={handleHideAssetInformation} />}</Tooltip></label>,
                                    labelStyle: { 'text-align': 'right', width: '30%', fontWeight: 'bold' },
                                    span: '3',
                                    children: orderDetail?.assetInformations?.map((v, i) => (<><Text key={i}>{hideAssetInformation === true ? "******" : v}</Text><br /></>))
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