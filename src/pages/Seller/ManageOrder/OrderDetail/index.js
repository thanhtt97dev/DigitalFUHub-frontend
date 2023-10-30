import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { customerUpdateStatusOrder, getOrderDetailCustomer, getOrderDetailSeller, updateDisputeOrder, updateRefundOrder } from "~/api/order";
import { ParseDateTime, formatStringToCurrencyVND, getUserId } from "~/utils";
import {
    ShopOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    LeftOutlined,
    PlusOutlined,
    MessageOutlined,
    UserOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Rate, Row, Space, Typography, Tag, Tooltip, Form, Upload, Modal, Avatar, Spin } from "antd";
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import { useAuthUser } from 'react-auth-kit'
import { getConversation } from '~/api/chat'
import TextArea from "antd/es/input/TextArea";

const { Text, Title, Paragraph } = Typography;

function OrderDetailSeller() {
    const auth = useAuthUser()
    const user = auth();
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})

    useEffect(() => {
        setLoading(true);
        getOrderDetailSeller(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                    return navigate("/seller/order/list");
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
                return navigate("/seller/order/list");
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleOrderDispute = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: 5
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        prev.statusId = dataBody.statusId
                        return { ...prev }
                    })
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => {
                notification("error", "Đã có lỗi xảy ra.")
            })
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
                    <Tag color="green" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Chờ xác nhận</Tag>
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
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Hoàn trả tiền</Button>
                </Col>
                <Col>
                    <Button type="default" danger onClick={handleDisputeOrder}>Tranh chấp</Button>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button
                        type="primary"
                        danger
                        icon={<MessageOutlined />}
                        onClick={handleOpenChatGroupForDepositeOrder}
                    >
                        Nhắn tin với người mua và quản trị viên
                    </Button>
                </Col>
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
    const handleOpenChat = () => {
        var data = { shopId: order.shopId, userId: user.id }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }
    const handleOpenChatGroupForDepositeOrder = () => {
        var data = { shopId: order.shopId, userId: user.id, isGroup: true }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancelModal = () => {
        setIsModalOpen(false);
    }
    const handleSubmitRefundOrder = ({ note }) => {
        const data = {
            note: note,
            orderId: order.orderId,
            sellerId: getUserId()
        }
        updateRefundOrder(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        prev.statusId = ORDER_SELLER_REFUNDED;
                        return { ...prev }
                    })
                    notification("success", "Hoàn tiền đơn hàng thành công.");
                } else {
                    notification("error", "Vui lòng kiểm tra lại.");
                }
                setIsModalOpen(false);
            })
            .catch((err) => {
                setIsModalOpen(false);
                notification("error", "Đã có lỗi xảy ra.");
            })
    }
    const handleDisputeOrder = () => {
        Modal.confirm({
            title: 'Xác nhận tranh chấp đơn hàng',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có muốn tranh chấp đơn hàng này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                const data = {
                    customerId: order.customerId,
                    sellerId: getUserId(),
                    orderId: order.orderId
                }
                updateDisputeOrder(data)
                    .then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setOrder(prev => {
                                prev.statusId = ORDER_DISPUTE;
                                return { ...prev }
                            })
                            notification("success", "Đơn hàng được chuyển sang tranh chấp, vui lòng vào chat để người quản lý giải quyết.");
                        } else {
                            notification("error", "Vui lòng kiểm tra lại.");
                        }
                    })
                    .catch((err) => { notification("error", "Đã có lỗi xảy ra."); })
            }

        });
    };
    return (<>
        <Modal
            title="Hoàn trả tiền người mua"
            footer={null}
            open={isModalOpen}
            onOk={handleCancelModal}
            onCancel={handleCancelModal}>
            <Form
                onFinish={handleSubmitRefundOrder}
            >
                <Row>
                    <Col span={4} offset={1}><Text>Nội dung:</Text></Col>
                    <Col span={19}>
                        <Form.Item name="note"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const data = !value ? "" : value.trim();
                                        if (!data) {
                                            return Promise.reject(new Error('Nội dung phản hồi không để trống.'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                }),
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end" gutter={[16, 0]}>
                    <Col><Button type="default" danger >Hủy</Button></Col>
                    <Col><Button type="primary" htmlType="submit">Xác nhận</Button></Col>
                </Row>
            </Form>
        </Modal >
        <Card
            title={
                <Row>
                    <Col span={1}>
                        <Link to={"/seller/order/list"}><LeftOutlined />Trở lại</Link>
                    </Col>
                    {/* <Col span={2} push={1}>
                        <Title level={5}>Chi tiết đơn hàng</Title>
                    </Col> */}
                    {!loading &&
                        <Col span={23}>
                            <Row justify="end" gutter={[16, 0]}>
                                <Col><Text>Mã đơn hàng: #{order?.orderId}</Text></Col>
                                <Col>|</Col>
                                <Col><Text>Ngày đặt hàng: {ParseDateTime(order?.orderDate)}</Text></Col>
                                <Col>|</Col>
                                <Col><Text>{getTextStatusOrder()}</Text></Col>
                            </Row>
                        </Col>
                    }
                </Row>
            }
        >
            <Spin spinning={loading}>
                {!loading &&
                    <Card
                        title={<Row gutter={[8, 0]} align="bottom">
                            <Col>
                                <Title level={5}><UserOutlined style={{ fontSize: '18px' }} /></Title>
                            </Col>
                            <Col>
                                <Title level={5}>{order.customerUsername}</Title>
                            </Col>
                            <Col>
                                <Title level={5}>
                                    <Button
                                        type="default"
                                        size="small"
                                        icon={<MessageOutlined />}
                                        onClick={handleOpenChat}
                                    >
                                        Nhắn tin
                                    </Button>
                                </Title>
                            </Col>
                        </Row>}
                        bordered={true}
                    >
                        <Row gutter={[0, 32]}>
                            {order?.orderDetails?.map((v, i) => {
                                return (
                                    <Col span={24} key={i}>
                                        <Row gutter={[8, 8]}>
                                            <Col flex={0}>
                                                <Link to={`/product/${v.productId}`} target="_blank" rel="noopener noreferrer" >
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
                                                                    {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.slice(0, 70)}...</Tooltip> : v.productName}
                                                                </Title>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={24}><Text>{`Phân loại: ${v.productVariantName}`}</Text></Col>
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
                                        </Row>
                                    </Col>
                                )
                            })}
                        </Row>
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
                                    <Col span={24}>
                                        <Row justify="end">
                                            <Col span={5}>
                                                <Divider />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        <Row justify="end">
                                            <Col style={{ textAlign: 'right' }}><Title level={5}>Tổng đơn hàng:</Title></Col>
                                            <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                                <Text>{`${formatStringToCurrencyVND(order.totalPayment - order.totalCouponDiscount)}₫`}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={24}>
                                {getButtonsStatus()}
                            </Col>
                        </Row>

                        {order.note &&
                            <Row>
                                <Col span={24}><Divider><Title level={5}>Lời nhắn</Title></Divider></Col>
                                <Col span={23}>
                                    <Text>{order.note}</Text>
                                </Col>
                            </Row>
                        }
                    </Card>
                }
            </Spin>
        </Card>
    </>);
}

export default OrderDetailSeller;