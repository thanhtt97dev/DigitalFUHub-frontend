/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { customerUpdateStatusOrder, getOrderDetailCustomer } from "~/api/order";
import { ParseDateTime, formatPrice, getUserId } from "~/utils";
import {
    ShopOutlined,
    CheckCircleOutlined,
    // ClockCircleOutlined,
    //CloseCircleOutlined,
    //ExclamationCircleOutlined,
    //MinusCircleOutlined,
    SyncOutlined,
    LeftOutlined,
    // PlusOutlined,
    MessageOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Typography, Tag, Spin, Descriptions } from "antd";
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { addFeedbackOrder, getFeedbackDetail } from "~/api/feedback";
import { useAuthUser } from 'react-auth-kit'
import { getConversation } from '~/api/chat'
import ModalChangeOrderStatusComplaint from "~/components/Modals/ModalChangeOrderStatusComplaint";
import ModalViewFeedbackOrder from "~/components/Modals/ModalViewFeedbackOrder";
import ModalAddFeedbackOrder from "~/components/Modals/ModalAddFeedbackOrder";
import HistoryOrderStatus from "~/components/OrderDetail/HistoryOrderStatus";
import OrderDetailItem from "~/components/OrderDetail/OrderDetailItem";

const { Text, Title } = Typography;

function OrderDetail() {
    const auth = useAuthUser()
    const user = auth();
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})

    const getOrderDetail = useCallback(() => {
        setLoading(true);
        getOrderDetailCustomer(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                    return navigate("/history/order");
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
                return navigate("/history/order");
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
    }, [])

    useEffect(() => {
        getOrderDetail();
    }, [])
    const handleOrderComplaint = () => {
        getOrderDetail();
    }

    const handleOrderComplete = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: ORDER_CONFIRMED
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    getOrderDetail();
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
            .finally();
    }
    const [isModalAddFeedbackOpen, setIsModalAddFeedbackOpen] = useState(false);
    const orderDetailRef = useRef();
    const showModalAddFeedback = () => {
        setIsModalAddFeedbackOpen(true);
    };
    const handleModalAddFeedbackOk = () => {
        setIsModalAddFeedbackOpen(false);
    };
    const handleModalAddFeedbackCancel = () => {
        setIsModalAddFeedbackOpen(false);
    };
    const handleSubmitFeedback = (values) => {
        var formData = new FormData();
        formData.append("userId", getUserId());
        formData.append("orderId", orderId);
        formData.append("orderDetailId", orderDetailRef.current);
        formData.append("rate", values.rate);
        formData.append("content", values.content ?? "");
        if (values.imageFiles || values.imageFiles?.fileList?.length > 0) {
            values.imageFiles.fileList.forEach((v) => {
                formData.append("imageFiles", v.originFileObj);
            })
        } else {
            formData.append("imageFiles", null);
        }
        handleModalAddFeedbackOk()
        addFeedbackOrder(formData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    getOrderDetail();
                }
            })
            .catch((err) => {

            })
    }
    const [isModalViewFeedbackOpen, setIsModalViewFeedbackOpen] = useState(false);
    const [feedbackDetail, setFeedbackDetail] = useState([]);
    const showModalViewFeedback = () => {
        setIsModalViewFeedbackOpen(true);
    };
    const handleModalViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleModalViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleCustomerViewFeedback = (orderId) => {
        getFeedbackDetail(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    showModalViewFeedback();
                    setFeedbackDetail(res.data.result);
                }
            })
            .catch((err) => {
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
                    <ModalChangeOrderStatusComplaint orderId={orderId} shopId={order?.shopId} callBack={handleOrderComplaint} />
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
                {order.orderDetails.some((v, i) => v.isFeedback === true) ?
                    <Col>
                        <Button type="default" onClick={() => handleCustomerViewFeedback(orderId)}>Xem đánh giá</Button>
                    </Col>
                    : ''
                }
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
                    <Button
                        type="primary"
                        danger
                        icon={<MessageOutlined />}
                        onClick={handleOpenChatGroupForDepositeOrder}
                    >
                        Nhắn tin với người bán và quản trị viên
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
    return (<>
        <ModalViewFeedbackOrder
            isModalViewFeedbackOpen={isModalViewFeedbackOpen}
            handleViewFeedbackOk={handleModalViewFeedbackOk}
            handleViewFeedbackCancel={handleModalViewFeedbackCancel}
            feedbackDetail={feedbackDetail}
        />
        <ModalAddFeedbackOrder
            isModalOpen={isModalAddFeedbackOpen}
            handleModalFeedbackOk={handleModalAddFeedbackOk}
            handleModalFeedbackCancel={handleModalAddFeedbackCancel}
            handleSubmitFeedback={handleSubmitFeedback}
        />
        {order &&
            <Card
                title={
                    <Row>
                        <Col span={2}>
                            <Link to={"/history/order"}><LeftOutlined />Trở lại</Link>
                        </Col>
                        {!loading &&
                            <Col span={22}>
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
                        <>
                            <HistoryOrderStatus historyOrderStatus={order.historyOrderStatus} current={order.statusId} />
                            <Card
                                style={{ marginTop: '2em' }}
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
                                            <OrderDetailItem
                                                key={i}
                                                orderDetail={v}
                                                statusId={order.statusId}
                                                handleFeedbackOrder={() => { orderDetailRef.current = v.orderDetailId; showModalAddFeedback(); }}
                                            />
                                        )
                                    })}
                                </Row>
                                <Divider />
                                <Row gutter={[0, 16]}>
                                    <Col span={24}>
                                        <Row justify='end'>
                                            {(() => {
                                                let infoPayment = [];
                                                infoPayment.push({
                                                    key: '1',
                                                    label: 'Tổng tiền sản phẩm',
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>{formatPrice(order?.totalAmount)}</Text>
                                                })
                                                if (order?.totalCouponDiscount !== 0) {
                                                    infoPayment.push({
                                                        key: '2',
                                                        label: 'Mã giảm giá',
                                                        labelStyle: { 'text-align': 'right' },
                                                        span: '3',
                                                        children: <Text>-{formatPrice(order?.totalCouponDiscount)}</Text>
                                                    })
                                                }
                                                infoPayment.push({
                                                    key: '3',
                                                    label: 'Số xu sử dụng',
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>-{order?.totalCoinDiscount} xu</Text>
                                                })
                                                infoPayment.push({
                                                    key: '4',
                                                    label: <Text style={{ fontWeight: 'bold' }}>Thành tiền</Text>,
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>{`${formatPrice(order.totalPayment)}`}</Text>
                                                })
                                                return <Col span={24}><Descriptions bordered items={infoPayment} /></Col>
                                            })()}
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        {getButtonsStatus()}
                                    </Col>
                                </Row>

                                {/* {order.note &&
                                    <Row>
                                        <Col span={24}><Divider><Title level={5}>Lời nhắn</Title></Divider></Col>
                                        <Col span={23}>
                                            <Text>{order.note}</Text>
                                        </Col>
                                    </Row>
                                } */}
                            </Card>
                        </>
                    }
                </Spin >
            </Card >
        }

    </>);
}

export default OrderDetail;