import CardOrderItem from "../CardOrderItem";
import { Avatar, Button, Col, Empty, Image, Modal, Rate, Row, Spin, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { ParseDateTime, getUserId } from "~/utils";
import { getListOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { addFeedbackOrder, getFeedbackDetail } from "~/api/feedback";
import logoFPT from '~/assets/images/fpt-logo.jpg'
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography
function OrdersConfirmed({ status, loading, setLoading }) {
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: status
    });
    const [orders, setOrders] = useState([]);
    const nextOffset = useRef(0)
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    useEffect(() => {
        if (nextOffset.current !== -1) {
            if (nextOffset.current !== 0) {
                setLoadingMoreData(true);
            }
            // call api
            getListOrdersCustomer(paramSearch)
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders([...orders, ...res.data.result.orders]);
                        nextOffset.current = res.data.result.nextOffset;
                    }
                })
                .catch(err => { })
            if (loading) {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout)
                }, 300)
            }
            setLoadingMoreData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearch])
    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
            if (scrollMaxY - window.scrollY <= 150) {
                if (nextOffset.current !== -1 && !loadingMoreData) {
                    setParamSearch({ ...paramSearch, offset: nextOffset.current })
                }
            }
        })
        return () => {
            window.removeEventListener("scroll", () => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleCustomerFeedback = (formData) => {
        const orderId = formData.get("orderId");
        const orderDetailId = formData.get("orderDetailId");
        addFeedbackOrder(formData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === parseInt(orderId));
                        const orderDetail = order.orderDetails.find((v) => v.orderDetailId === parseInt(orderDetailId))
                        orderDetail.isFeedback = true;
                        return [...prev];
                    })
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
    const handleViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleCustomerViewFeedback = (orderId) => {
        getFeedbackDetail(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setFeedbackDetail(res.data.result);
                    showModalViewFeedback();
                }
            })
            .catch((err) => {
            })
    }
    return (<div>
        {!loading ?
            orders.length > 0 ?
                <>
                    <Row gutter={[0, 16]} style={{ padding: '0 50px' }}>
                        {orders.map((v, i) => {
                            return <Col span={24}>
                                <CardOrderItem key={v.orderId}
                                    orderId={v.orderId}
                                    note={v.note}
                                    orderDate={v.orderDate}
                                    shopId={v.shopId}
                                    shopName={v.shopName}
                                    statusId={v.statusId}
                                    totalAmount={v.totalAmount}
                                    totalCoinDiscount={v.totalCoinDiscount}
                                    totalCouponDiscount={v.totalCouponDiscount}
                                    totalPayment={v.totalPayment}
                                    orderDetails={v.orderDetails}
                                    onFeedback={handleCustomerFeedback}
                                    onViewFeedback={() => handleCustomerViewFeedback(v.orderId)}
                                />
                            </Col>
                        })}
                        <Col span={24}>
                            <Row justify="center" gutter={8}>
                                <Spin spinning={loadingMoreData}></Spin>
                            </Row>
                        </Col>
                    </Row>
                    <Modal title="Đánh giá cửa hàng" open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk} onCancel={handleViewFeedbackCancel}
                        footer={[
                            <Button key="close" onClick={handleViewFeedbackOk}>
                                Đóng
                            </Button>,
                        ]}
                    >
                        <Row gutter={[0, 16]}>
                            {feedbackDetail.map((v, i) => <>
                                <Col span={24} key={i}>
                                    <Row gutter={[8, 8]} wrap={false}>
                                        <Col flex={0}>
                                            <Link to={`/product/${v.productId}`}>
                                                <Image
                                                    preview={false}
                                                    width={60}
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
                    </Modal>
                </>
                :
                <Empty />
            : null
        }
    </div>);
}

export default OrdersConfirmed;