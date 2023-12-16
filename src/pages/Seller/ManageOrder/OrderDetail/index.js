/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderDetailSeller, updateRefundOrder } from "~/api/order";
import { ParseDateTime, formatPrice, getUserId } from "~/utils";
import {
    CheckCircleOutlined,
    LeftOutlined,
    MessageOutlined,
    ExclamationCircleFilled,
    EyeOutlined,
    EyeInvisibleOutlined
} from "@ant-design/icons";
import logoFPT from '~/assets/images/fpt-logo.jpg'
import { Button, Card, Col, Divider, Image, Row, Space, Typography, Tag, Tooltip, Form, Modal, Avatar, Spin, Descriptions, Rate } from "antd";
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED, RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE, RESPONSE_CODE_SHOP_BANNED } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useAuthUser } from 'react-auth-kit'
import { getConversation } from '~/api/chat'
import TextArea from "antd/es/input/TextArea";
import ModalChangeOrderStatusDispute from "~/components/Modals/ModalChangeOrderStatusDispute";
import HistoryOrderStatus from "~/components/OrderDetail/HistoryOrderStatus";
import { getFeedbackDetailOrderOfSeller } from "~/api/feedback";

const { Text, Title, Paragraph } = Typography;

// const getTextNoteFrom = (orderStatusId) => {
//     if (orderStatusId === ORDER_COMPLAINT) {
//         return "Lý do (Phản hồi từ người mua)";
//     } else if (orderStatusId === ORDER_DISPUTE || orderStatusId === ORDER_SELLER_REFUNDED) {
//         return "Lý do (Phản hồi từ người bán)";
//     } else if (orderStatusId === ORDER_REJECT_COMPLAINT || orderStatusId === ORDER_SELLER_VIOLATES) {
//         return "Lý do (Phản hồi từ quản trị viên)";
//     } else {
//         return "";
//     }
// }
const getNote = (historyOrderStatus) => {
    if (!historyOrderStatus) return null;
    let notes = [];
    notes = historyOrderStatus.map((v, i) => {
        if (v.orderStatusId === ORDER_COMPLAINT && v.note) {
            return <Descriptions bordered>
                <Descriptions.Item labelStyle={{ width: '25%', color: 'red', fontWeight: '600' }} label={`Phản hồi người mua (Khiếu nại)`}>
                    {v.note}
                </Descriptions.Item>
            </Descriptions>
        } else if ((v.orderStatusId === ORDER_DISPUTE || v.orderStatusId === ORDER_SELLER_REFUNDED) && v.note) {
            return <Descriptions bordered>
                <Descriptions.Item labelStyle={{ width: '25%', color: 'red', fontWeight: '600' }} label={`Phản hồi người bán (${v.orderStatusId === ORDER_DISPUTE ? 'Tranh chấp' : 'Hoàn trả tiền'})`}>
                    {v.note}
                </Descriptions.Item>
            </Descriptions>
        } else if ((v.orderStatusId === ORDER_REJECT_COMPLAINT || v.orderStatusId === ORDER_SELLER_VIOLATES) && v.note) {
            return <Descriptions bordered>
                <Descriptions.Item labelStyle={{ width: '25%', color: 'red', fontWeight: '600' }} label={`Phản hồi quản trị viên (${v.orderStatusId === ORDER_REJECT_COMPLAINT ? 'Từ chối khiếu nại' : 'Người bán vi phạm'})`}>
                    {v.note}
                </Descriptions.Item>
            </Descriptions>
        } else {
            return null;
        }
    })
    return notes;
}
function OrderDetailSeller() {
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    const [noteRefundOrder, setNoteRefundOrder] = useState('');
    const [hideAssetInformationOrder, setHideAssetInformationOrder] = useState([]);
    const getOrderDetail = useCallback(() => {
        setLoading(true);
        getOrderDetailSeller(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                    let lsIndexOrderDetail = [];
                    for (var i = 0; i < res.data.result.orderDetails.length; i++) {
                        lsIndexOrderDetail.push(true);
                    }
                    setHideAssetInformationOrder(lsIndexOrderDetail);
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                    return navigate('/shopBanned')
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                    return navigate("/seller/order/list");
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
                return navigate("/seller/order/list");
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
    }, []);
    useEffect(() => {
        getOrderDetail();
    }, [])
    // const handleOrderDispute = () => {
    //     // call api
    //     const dataBody = {
    //         userId: getUserId(),
    //         shopId: order.shopId,
    //         orderId: order.orderId,
    //         statusId: 5
    //     }
    //     customerUpdateStatusOrder(dataBody)
    //         .then(res => {
    //             if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
    //                 setOrder(prev => {
    //                     prev.statusId = dataBody.statusId
    //                     return { ...prev }
    //                 })
    //             } else {
    //                 notification("error", "Đã có lỗi xảy ra.")
    //             }
    //         })
    //         .catch(err => {
    //             notification("error", "Đã có lỗi xảy ra.")
    //         })
    // }
    const [isModalViewFeedbackOpen, setIsModalViewFeedbackOpen] = useState(false);
    const [feedbackDetail, setFeedbackDetail] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const showModalViewFeedback = () => {
        setIsModalViewFeedbackOpen(true);
    };
    const handleViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleSellerViewFeedback = (orderId) => {
        showModalViewFeedback();
        setModalLoading(true);
        getFeedbackDetailOrderOfSeller(getUserId(), orderId)
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
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setModalLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
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
                    <Tag style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Chờ xác nhận</Tag>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đã xác nhận</Tag>
                </Col>
                {order.orderDetails.some((v, i) => v.isFeedback === true) ?
                    <Col>
                        <Button type="default" onClick={() => handleSellerViewFeedback(orderId)}>Xem đánh giá</Button>
                    </Col>
                    : ''
                }
            </Row>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag style={{ fontSize: 14, height: 32, lineHeight: 2.2, color: '#D6B656', border: '1px solid #D6B656' }}
                        color="#FFF2CC">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Hoàn trả tiền</Button>
                </Col>
                <Col>
                    <ModalChangeOrderStatusDispute
                        shopId={order.shopId}
                        customerId={order.customerId}
                        orderId={order.orderId}
                        callBack={handleDisputeOrder}
                    />
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="#FAD7AC"
                        style={{ fontSize: 14, height: 32, lineHeight: 2.2, color: '#B46504', border: '1px solid #B46504' }}>Đang tranh chấp</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Hoàn trả tiền</Button>
                </Col>
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
            </Row>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="#E1D5E7"
                        style={{ fontSize: 14, height: 32, lineHeight: 2.2, color: '#9673A6', border: '1px solid #9673A6' }}>Từ chối khiếu nại</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn trả tiền</Tag>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="#FAD9D5"
                        style={{ fontSize: 14, height: 32, lineHeight: 2.2, color: '#AE4132', border: '1px solid #AE4132' }}>Người bán vi phạm</Tag>
                </Col>
            </Row>
        }
    }
    const handleOpenChat = () => {
        var data = { shopId: getUserId(), userId: order.customerId };
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
        return navigate('/chatBox', { state: { data: order.conversationId } })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const handleCancelModal = () => {
        setIsModalOpen(false);
    }
    const handleSubmitRefundOrder = ({ note }) => {
        setNoteRefundOrder(note);
        const data = {
            note: note,
            orderId: order.orderId,
            sellerId: getUserId()
        }
        setButtonLoading(true);
        updateRefundOrder(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    getOrderDetail();
                    notification("success", "Hoàn tiền đơn hàng thành công.");
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.");
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    setIsModalOpen(false);
                    clearTimeout(idTimeout);
                }, 300)
            })
    }
    const handleDisputeOrder = () => {
        getOrderDetail();
    };
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
        <Modal title="Đánh giá cửa hàng" open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk} onCancel={handleViewFeedbackCancel}
            footer={[
                <Button key="close" onClick={handleViewFeedbackOk}>
                    Đóng
                </Button>,
            ]}
        >
            <Spin spinning={modalLoading}>
                <Row gutter={[0, 16]}>
                    {feedbackDetail.map((v, i) => <>
                        <Col span={24} key={i}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Link to={`/product/${v.productId}`}>
                                        <Image
                                            preview={false}
                                            width={60}
                                            height={60}
                                            src={v.thumbnail}
                                        />
                                    </Link>
                                </Col>
                                <Col flex={5}>
                                    <Row>
                                        <Col span={23}><Title level={5}>{v.productName}</Title></Col>
                                        <Col span={23}><Text>{`Phân loại: ${v.productVariantName} x ${v.quantity}`}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={23} offset={1}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Avatar size="large" src={v.avatar || logoFPT} />
                                </Col>
                                <Col flex={5} >
                                    <Row >
                                        <Col span={23}><Text>{v.username}</Text></Col>
                                        <Col span={23}><Rate value={v.rate} disabled style={{ fontSize: "14px" }} /></Col>
                                        <Col span={23}><Paragraph>{v.content}</Paragraph></Col>
                                        <Col span={23} >
                                            <Row gutter={[8, 8]}>
                                                {v?.urlImages?.map((url, i) => <Col>
                                                    <Image
                                                        width={80}
                                                        src={url}
                                                        preview={{
                                                            movable: false,
                                                        }}
                                                    />
                                                </Col>)}
                                            </Row>
                                        </Col>
                                        <Col span={23}><Text>{ParseDateTime(v.date)}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </>)}
                </Row>
            </Spin>
        </Modal>
        <Modal
            title={<><ExclamationCircleFilled style={{ color: "#faad14" }} />Bạn có chắc chắn muốn hoàn trả tiền người mua</>}
            footer={null}
            open={isModalOpen}
            onOk={handleCancelModal}
            onCancel={handleCancelModal}>
            <Form
                onFinish={handleSubmitRefundOrder}
                fields={[
                    {
                        name: 'note',
                        value: noteRefundOrder
                    }
                ]}
            >
                <Row>
                    <Col span={4} offset={1}><Text> <span style={{ color: '#ff4d4f', marginInlineEnd: '4px' }}>*</span>Lý do:</Text></Col>
                    <Col span={19}>
                        <Form.Item name="note"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const data = !value ? "" : value.trim();
                                        if (!data) {
                                            return Promise.reject(new Error('Lý do không được để trống.'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                }),
                            ]}
                        >
                            <TextArea placeholder="Nhập lý do hoàn trả tiền đơn hàng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end" gutter={[16, 0]}>
                    <Col><Button type="default" danger onClick={handleCancelModal}>Hủy</Button></Col>
                    <Col><Button loading={buttonLoading} type="primary" htmlType="submit">Xác nhận</Button></Col>
                </Row>
            </Form>
        </Modal >
        <Card
            style={{ margin: '0 1em 0 1em' }}
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
                        <HistoryOrderStatus historyOrderStatus={order?.historyOrderStatus} current={order?.statusId} />
                        <Card
                            style={{ margin: '3em 0em 3em 0em' }}
                            title={<Row gutter={[8, 0]} align="bottom">
                                <Col>
                                    {/* <Title level={5}><UserOutlined style={{ fontSize: '18px' }} /></Title> */}
                                    <Avatar src={order.customerAvatar || logoFPT} />
                                </Col>
                                <Col>
                                    <Title level={5}>{order.customerUsername}</Title>
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
                                        <Col span={24} key={i}>
                                            <Row gutter={[8, 8]}>
                                                <Col flex={0}>
                                                    <Link to={`/product/${v.productId}`} target="_blank" rel="noopener noreferrer" >
                                                        <Image
                                                            width={100}
                                                            height={100}
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
                                                                    <Title level={5} style={{ marginBottom: 0 }}>
                                                                        {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.slice(0, 70)}...</Tooltip> : v.productName}
                                                                    </Title>
                                                                </Col>
                                                                {v.isFeedback && <Col offset={1} span={6}>
                                                                    <Row justify="end" gutter={[8, 0]}>
                                                                        <Col>
                                                                            <Text>Đánh giá</Text>
                                                                        </Col>
                                                                        <Col>
                                                                            <Rate style={{
                                                                                fontSize: '14px',
                                                                                lineHeight: '1.2',
                                                                            }} disabled value={v.feedbackRate} />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>}
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
                                                                            <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600' }}>{formatPrice(v.price)}</Text>
                                                                            :
                                                                            <Space size={[8, 0]}>
                                                                                <Text delete style={{ color: 'rgba(0, 0, 0, .4)' }}>{formatPrice(v.price)}</Text>
                                                                                <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600' }}>{formatPrice(v.price - (v.price * v.discount / 100))}</Text>
                                                                            </Space>
                                                                        }
                                                                    </Row>
                                                                </Col>
                                                                <Col span={24}>
                                                                    <Row justify='end'>
                                                                        <Col span={24}>
                                                                            <Descriptions bordered items={[
                                                                                {
                                                                                    key: '1',
                                                                                    label: <label>Thông tin tài khoản <Tooltip title={hideAssetInformationOrder[i] === true ? "Hiển thị" : "Ẩn"}>{hideAssetInformationOrder[i] === true ? <EyeOutlined style={{ cursor: 'pointer' }} onClick={() => handleDisplayAssetInformation(i)} /> : <EyeInvisibleOutlined style={{ cursor: 'pointer' }} onClick={() => handleHideAssetInformation(i)} />}</Tooltip></label>,
                                                                                    labelStyle: { 'text-align': 'right', width: '30%', fontWeight: 'bold' },
                                                                                    span: '3',
                                                                                    children: v?.assetInformations?.map((v, i) => (<><Text key={i}>{hideAssetInformationOrder[i] === true ? "******" : v}</Text><br /></>))
                                                                                },
                                                                            ]} />
                                                                        </Col>
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


                            {/* {order.note &&
                                <Row>
                                    <Col span={24}><Divider><Title level={5}>Lời nhắn</Title></Divider></Col>
                                    <Col span={23}>
                                        <Text>{order.note}</Text>
                                    </Col>
                                </Row>
                            } */}
                        </Card>
                        {/* {order?.note &&
                            <>
                                <Descriptions bordered style={{ marginTop: '1em' }}>
                                    <Descriptions.Item label={getTextNoteFrom(order?.statusId)} labelStyle={{ width: '20%', fontWeight: '600', color: 'red' }}>{order?.note}</Descriptions.Item>
                                </Descriptions>
                            </>
                        } */}
                        <div style={{ marginTop: '1em' }}>
                            {getNote(order?.historyOrderStatus)}
                        </div>
                        <Row gutter={[0, 16]} style={{ marginTop: '1em' }}>
                            <Col span={24}>
                                <Row justify="end">
                                    {(() => {
                                        let infoPayment = [];

                                        infoPayment.push({
                                            key: '1',
                                            label: 'Tổng giá trị đơn hàng',
                                            labelStyle: { 'text-align': 'right' },
                                            span: '3',
                                            children: <Text>{formatPrice(order?.totalAmount)}</Text>
                                        })


                                        infoPayment.push({
                                            key: '2',
                                            // label: `Mã giảm giá${order?.couponCode ? `\n(${order?.couponCode})` : ''}`,
                                            label: <>
                                                <div>Mã giảm giá</div>
                                                {order?.couponCode ? <div>({order?.couponCode})</div> : ''}
                                            </>,
                                            labelStyle: { 'text-align': 'right' },
                                            span: '3',
                                            children: <Text>{order?.totalCouponDiscount !== 0 ?
                                                `-${formatPrice(order?.totalCouponDiscount)}`
                                                :
                                                'Không áp dụng'
                                            }</Text>
                                        })

                                        infoPayment.push({
                                            key: '4',
                                            label: <Text style={{ fontWeight: 'bold' }}>Thành tiền</Text>,
                                            labelStyle: { 'text-align': 'right' },
                                            span: '3',
                                            children: <Text>{`${formatPrice(order.totalAmount - order?.totalCouponDiscount)}`}</Text>
                                        })
                                        infoPayment.push({
                                            key: '4',
                                            label: <Text style={{ fontWeight: 'bold' }}>Phí dịch vụ ({order.percentBusinessFee}% tổng giá trị đơn hàng)</Text>,
                                            labelStyle: { 'text-align': 'right' },
                                            span: '3',
                                            children: <Text>{`-${formatPrice(order.businessFeePrice)}`}</Text>
                                        })
                                        infoPayment.push({
                                            key: '4',
                                            label: <Text style={{ fontWeight: 'bold' }}>Lợi nhuận</Text>,
                                            labelStyle: { 'text-align': 'right' },
                                            span: '3',
                                            children: <Text style={{ color: 'rgb(22, 119, 255)', fontWeight: '600', fontSize: '20px' }}>{`${formatPrice(order.amountSellerReceive)}`}</Text>
                                        })
                                        return <Col span={24}><Descriptions bordered items={infoPayment} /></Col>
                                    })()}
                                </Row>

                            </Col>
                            <Col span={24}>
                                {getButtonsStatus()}
                            </Col>
                        </Row>
                    </>
                }
            </Spin>
        </Card>
    </>);
}

export default OrderDetailSeller;