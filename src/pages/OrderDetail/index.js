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
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED, RESPONSE_CODE_NOT_FEEDBACK_AGAIN, RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE } from "~/constants";
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
const getTextNoteFrom = (orderStatusId) => {
    if (orderStatusId === ORDER_COMPLAINT) {
        return "Lý do (Phản hồi từ người mua)";
    } else if (orderStatusId === ORDER_DISPUTE || orderStatusId === ORDER_SELLER_REFUNDED) {
        return "Lý do (Phản hồi từ người bán)";
    } else if (orderStatusId === ORDER_REJECT_COMPLAINT || orderStatusId === ORDER_SELLER_VIOLATES) {
        return "Lý do (Phản hồi từ quản trị viên)";
    } else {
        return "";
    }
}

function OrderDetail() {
    const auth = useAuthUser()
    const user = auth();
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    const [hideAssetInformationOrder, setHideAssetInformationOrder] = useState([]);

    const getOrderDetail = useCallback(() => {
        setLoading(true);
        getOrderDetailCustomer(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                    let lsIndexOrderDetail = [];
                    for (var i = 0; i < res.data.result.orderDetails.length; i++) {
                        lsIndexOrderDetail.push(true);
                    }
                    setHideAssetInformationOrder(lsIndexOrderDetail);
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
        setButtonLoading(true);
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
                    notification("success", "Xác nhận đơn hàng thành công.")
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            });
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
    const [buttonLoading, setButtonLoading] = useState(false);
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
        setButtonLoading(true);

        addFeedbackOrder(formData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", `Đánh giá sản phẩm thành công bạn nhận được + ${res.data.result ? res.data.result : 0} xu.`);
                    getOrderDetail();
                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_FEEDBACK_AGAIN) {
                    notification("error", "Sản phẩm đã được đánh giá, vui lòng tải lại trang.");
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    handleModalAddFeedbackOk();
                    clearTimeout(idTimeout);
                }, 500)
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
        showModalViewFeedback();
        getFeedbackDetail(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setFeedbackDetail(res.data.result);
                } else {
                    notification("error", "Đã có lỗi xảy ra, vui lòng thử lại sau.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra, vui lòng thử lại sau.")
            })
    }

    const getTextStatusOrder = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Text>Chờ xác nhận</Text>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Text style={{ color: '#0958d9' }}>Đã xác nhận</Text>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Text style={{ color: '#D6B656' }}>Đang khiếu nại</Text>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Text style={{ color: '#B46504' }}>Đang tranh chấp</Text>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Text style={{ color: '#9673A6' }}>Từ chối khiếu nại</Text>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED) {
            return <Text style={{ color: '#08979c' }}>Hoàn trả tiền</Text>
        } else if (order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Text style={{ color: '#AE4132' }}>Người bán vi phạm</Text>
        }
    }
    const getButtonsStatus = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <ModalChangeOrderStatusComplaint orderId={orderId} shopId={order?.shopId} callBack={handleOrderComplaint} />
                </Col>
                <Col>
                    <Button loading={buttonLoading} type="primary" onClick={handleOrderComplete}>Xác nhận đơn hàng</Button>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2 }}>Đã xác nhận</Tag>
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
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#D6B656', border: '1px solid #D6B656' }} color="#FFF2CC">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button loading={buttonLoading} type="primary" onClick={handleOrderComplete}>Xác nhận đơn hàng</Button>
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
                    <Tag icon={<SyncOutlined size={16} spin />} color="#FAD7AC" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#B46504', border: '1px solid #B46504' }}>Đang tranh chấp</Tag>
                </Col>
                <Col>
                    <Button loading={buttonLoading} type="primary" onClick={handleOrderComplete}>Xác nhận đơn hàng</Button>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="#E1D5E7" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#9673A6', border: '1px solid #9673A6' }}>Từ chối khiếu nại</Tag>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn trả tiền</Tag>
                </Col>
            </Row>
        }
        else if (order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="#FAD9D5" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#AE4132', border: '1px solid #AE4132' }}>Người bán vi phạm</Tag>
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
        if (order.conversationId === null) return;
        navigate('/chatBox', { state: { data: order.conversationId } })
    }
    const handleDisplayAssetInformation = (index) => {
        setHideAssetInformationOrder(prev => {
            let newValue = [prev];
            newValue[index] = false;
            return newValue;
        })
    }
    const handleHideAssetInformation = (index) => {
        setHideAssetInformationOrder(prev => {
            let newValue = [...prev];
            newValue[index] = true;
            return newValue;
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
            buttonLoading={buttonLoading}
            isModalOpen={isModalAddFeedbackOpen}
            handleModalFeedbackOk={handleModalAddFeedbackOk}
            handleModalFeedbackCancel={handleModalAddFeedbackCancel}
            handleSubmitFeedback={handleSubmitFeedback}
        />

        {order &&
            <Card
                style={{
                    backgroundColor: "#f5f5f5"
                }}
                title={
                    <Row>
                        <Col span={2}>
                            <Link to={"/history/order"}><LeftOutlined />Trở lại</Link>
                        </Col>
                        {!loading &&
                            <Col span={22}>
                                <Row justify="end" gutter={[16, 0]}>
                                    <Col><Text>Mã đơn hàng: {order?.orderId}</Text></Col>
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
                            <Card>
                                <HistoryOrderStatus historyOrderStatus={order.historyOrderStatus} current={order.statusId} />
                            </Card>
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
                                            <Link to={`/shop/${order.shopId}`}>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    icon={<ShopOutlined />}
                                                >
                                                    Xem cửa hàng
                                                </Button>
                                            </Link>
                                        </Title>
                                    </Col>
                                    <Col>
                                        <Title level={5}>
                                            <Button
                                                size="small"
                                                icon={<MessageOutlined />}
                                                onClick={handleOpenChat}
                                                danger
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
                                                hideAssetInformation={hideAssetInformationOrder[i] === undefined ? true : hideAssetInformationOrder[i]}
                                                statusId={order.statusId}
                                                handleHideAssetInformation={() => handleHideAssetInformation(i)}
                                                handleDisplayAssetInformation={() => handleDisplayAssetInformation(i)}
                                                handleFeedbackOrder={() => { orderDetailRef.current = v.orderDetailId; showModalAddFeedback(); }}
                                            />
                                        )
                                    })}
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
                            {order?.note &&
                                <>
                                    <Descriptions bordered style={{ marginTop: '1em' }}>
                                        <Descriptions.Item label={getTextNoteFrom(order?.statusId)} labelStyle={{ width: '20%', fontWeight: '600', color: 'red' }}>{order?.note}</Descriptions.Item>
                                    </Descriptions>
                                </>
                            }
                            <Card style={{ marginTop: "20px" }}>
                                <Row gutter={[0, 16]} style={{ marginTop: '1em' }}>
                                    <Col span={24}>
                                        <Row justify='end'>
                                            {(() => {
                                                let infoPayment = [];
                                                infoPayment.push({
                                                    key: '1',
                                                    label: 'Tổng giá trị đơn hàng',
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>{formatPrice(order?.totalAmount)}</Text>
                                                })
                                                // if (order?.totalCouponDiscount !== 0) {
                                                infoPayment.push({
                                                    key: '2',
                                                    label: 'Mã giảm giá',
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>{order?.totalCouponDiscount === 0 ? "Không áp dụng" : `-${formatPrice(order?.totalCouponDiscount)}`}</Text>
                                                })
                                                // }
                                                infoPayment.push({
                                                    key: '3',
                                                    label: <div>
                                                        <span>Sử dụng xu </span>
                                                        {order?.totalCoinDiscount !== 0 &&
                                                            <span>({order?.totalCoinDiscount} xu)</span>
                                                        }
                                                    </div>,
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text>{order?.totalCoinDiscount === 0 ? "Không áp dụng" : `-${formatPrice(order?.totalCoinDiscount)}`}</Text>
                                                })
                                                infoPayment.push({
                                                    key: '4',
                                                    label: <Text style={{ fontWeight: 'bold' }}>Thành tiền</Text>,
                                                    labelStyle: { 'text-align': 'right' },
                                                    span: '3',
                                                    children: <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600', fontSize: '20px' }}>{`${formatPrice(order.totalPayment)}`}</Text>
                                                })
                                                return <Col span={24}><Descriptions bordered items={infoPayment} /></Col>
                                            })()}
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        {getButtonsStatus()}
                                    </Col>
                                </Row>
                            </Card>
                        </>
                    }
                </Spin >
            </Card >
        }

    </>);
}

export default OrderDetail;