import {
    ShopOutlined,
    CheckCircleOutlined,
    // ClockCircleOutlined,
    // CloseCircleOutlined,
    // ExclamationCircleOutlined,
    // MinusCircleOutlined,
    SyncOutlined,
    // PlusOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row, Space, Tag, Tooltip, Typography } from "antd";
// import TextArea from "antd/es/input/TextArea";
import { memo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from 'react-auth-kit'

import { getConversation } from '~/api/chat'
import { ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED, RESPONSE_CODE_SUCCESS } from "~/constants";
import { formatPrice, getDistanceDayTwoDate, getUserId } from "~/utils";
import ModalChangeOrderStatusComplaint from "~/components/Modals/ModalChangeOrderStatusComplaint";
import ModalAddFeedbackOrder from "~/components/Modals/ModalAddFeedbackOrder";

const { Text, Title } = Typography;

// const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = (error) => reject(error);
//     });

function CardOrderItem({
    orderId,
    note,
    orderDate,
    shopId,
    shopName,
    conversationId,
    statusId,
    totalAmount,
    totalCoinDiscount,
    totalCouponDiscount,
    totalPayment,
    orderDetails,
    buttonLoading = false,
    onOrderComplete = () => { },
    onOrderComplaint = () => { },
    onFeedback = () => { },
    onViewFeedback = () => { }
}) {
    const auth = useAuthUser()
    const user = auth();
    const navigate = useNavigate()
    // const [form] = Form.useForm();
    // const [previewOpen, setPreviewOpen] = useState(false);
    // const [previewImage, setPreviewImage] = useState('');
    // const [previewTitle, setPreviewTitle] = useState('');
    // const [fileList, setFileList] = useState([]);
    // const handleCancel = () => setPreviewOpen(false);
    // const handlePreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setPreviewImage(file.url || file.preview);
    //     setPreviewOpen(true);
    //     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };
    // const handleChange = (info) => {
    //     let newFileList = [...info.fileList];

    //     newFileList = newFileList.slice(-5);

    //     newFileList = newFileList.map((file) => {
    //         if (file.response) {
    //             file.url = file.response.url;
    //         }
    //         file.response = '';
    //         file.status = 'done';
    //         return file;
    //     });
    //     setFileList(newFileList);
    // }
    const [orderIdChoosen, setOrderIdChoosen] = useState(0);
    const getButtonsStatus = () => {
        if (statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <ModalChangeOrderStatusComplaint orderId={orderId} shopId={shopId} callBack={onOrderComplaint} />
                </Col>
                <Col>
                    <Button loading={orderIdChoosen === orderId && buttonLoading} type="primary" onClick={() => {
                        onOrderComplete();
                        setOrderIdChoosen(orderId);
                    }}
                    >Xác nhận đơn hàng</Button>
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
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2 }}>Đã xác nhận</Tag>
                </Col>
                {orderDetails.some((v, i) => v.isFeedback === true) ?
                    <Col>
                        <Button type="default" onClick={onViewFeedback}>Xem đánh giá</Button>
                    </Col>
                    : ''
                }
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#D6B656', border: '1px solid #D6B656' }} color="#FFF2CC">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button loading={orderIdChoosen === orderId && buttonLoading} type="primary" onClick={() => {
                        onOrderComplete();
                        setOrderIdChoosen(orderId);
                    }}>Xác nhận đơn hàng</Button>
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
                    <Button loading={orderIdChoosen === orderId && buttonLoading} type="primary" onClick={() => {
                        onOrderComplete();
                        setOrderIdChoosen(orderId);
                    }}>Xác nhận đơn hàng</Button>
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
                    <Tag color="#E1D5E7" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#9673A6', border: '1px solid #9673A6' }}>Từ chối khiếu nại</Tag>
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
                    <Tag color="cyan" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        }
        // else if (statusId === ORDER_SELLER_VIOLATES) {
        //     return <Row justify="end" gutter={[8]}>
        //         <Col>
        //             <Tag color="#FAD9D5" style={{ width: '100%', fontSize: 14, height: 32, lineHeight: 2.2, color: '#AE4132', border: '1px solid #AE4132' }}>Người bán vi phạm</Tag>
        //         </Col>
        //         <Col>
        //             <Link to={`/history/order/${orderId}`}>
        //                 <Button type="default">Chi tiết</Button>
        //             </Link>
        //         </Col>
        //     </Row>
        // }
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const orderDetailRef = useRef();
    const showModalFeedback = () => {
        // setFileList([])
        // form.resetFields();
        setIsModalOpen(true);
    };
    const handleModalFeedbackOk = () => {
        setIsModalOpen(false);
    };
    const handleModalFeedbackCancel = () => {
        setIsModalOpen(false);
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
        onFeedback(formData, handleModalFeedbackOk);
    }

    const handleOpenChatWithSeller = () => {
        var data = { shopId, userId: user.id }
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
        if (conversationId === null) return;
        navigate('/chatBox', { state: { data: conversationId } })
    }
    const handleRedirectToShop = () => {
        return navigate(`/shop/${shopId}`)
    }

    return <>
        <ModalAddFeedbackOrder
            buttonLoading={buttonLoading}
            isModalOpen={isModalOpen}
            handleModalFeedbackOk={handleModalFeedbackOk}
            handleModalFeedbackCancel={handleModalFeedbackCancel}
            handleSubmitFeedback={handleSubmitFeedback}
        />
        <Card
            title={<Row gutter={[8, 0]} align="bottom">
                <Col>
                    <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
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
                            onClick={handleRedirectToShop}
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
                            onClick={handleOpenChatWithSeller}
                        >
                            Nhắn tin
                        </Button></Title>
                </Col>
                <Col flex={5}>
                    <Row justify="end">
                        <div style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Mã đơn hàng: {orderId}</div>
                    </Row>
                </Col>
            </Row>}
            bordered={true}
        >
            <Row gutter={[0, 16]}>
                {orderDetails.map((v, i) => {
                    return (<Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col flex={0}>
                                <Link to={`/product/${v.productId}`}>
                                    <Image
                                        width={90}
                                        height={90}
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
                                                <Link to={`/product/${v.productId}`}>
                                                    <Title level={5}>
                                                        {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.slice(0, 70)}...</Tooltip> : v.productName}
                                                    </Title>
                                                </Link>
                                            </Col>
                                            {!v.isFeedback && statusId === ORDER_CONFIRMED && getDistanceDayTwoDate(orderDate, new Date()) <= 7 && <Col offset={1} span={6}>
                                                <Row justify="end">
                                                    <Button type="primary" size="small" onClick={() => { orderDetailRef.current = v.orderDetailId; showModalFeedback(); }}>Đánh giá</Button>
                                                </Row>
                                            </Col>
                                            }
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
                                                        <Text>{formatPrice(v.price)}</Text>
                                                        :
                                                        <Space size={[8, 0]}>
                                                            <Text delete>{formatPrice(v.price)}</Text>
                                                            <Text>{formatPrice(v.price - (v.price * v.discount / 100))}</Text>
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
                        <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Thành tiền:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>{`${formatPrice(totalPayment)}`}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>
                <Col span={24}>
                    {getButtonsStatus()}
                </Col>
            </Row>
        </Card>

    </>;
}

export default memo(CardOrderItem);