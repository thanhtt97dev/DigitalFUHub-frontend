import { Col, Empty, Modal, Row } from "antd";
import CardOrderItem from "../CardOrderItem";
import { useContext, useEffect, useState } from "react";
import { getUserId } from "~/utils";
import { customerUpdateStatusOrder, getAllOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import { addFeedbackOrder } from "~/api/feedback";

function AllOrder({ status = 0, loading, setLoading }) {
    const notification = useContext(NotificationContext);
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: status
    });
    const [orders, setOrders] = useState([]);
    const [nextOffset, setNextOffset] = useState(0)
    useEffect(() => {
        if (nextOffset !== -1) {
            // call api
            getAllOrdersCustomer(paramSearch)
                .then(res => {

                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders(res.data.result.orders);
                        setNextOffset(res.data.result.nextOffset);
                    }
                })
                .catch(err => { })
            if (loading) {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout)
                }, 300)

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearch])
    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
            if (scrollMaxY - window.scrollY <= 300) {
                if (nextOffset !== -1) {
                    setParamSearch({ ...paramSearch, offset: nextOffset })
                }
            }
        })
        return () => {
            window.removeEventListener("scroll", () => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOrderComplaint = (orderId, shopId) => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: shopId,
            orderId: orderId,
            statusId: 3
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === orderId);
                        order.statusId = dataBody.statusId
                        return [...prev]
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => {
                notification("error", "Thất bại", "Đã có lỗi xảy ra.")
            })
    }

    const handleOrderComplete = (orderId, shopId) => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: shopId,
            orderId: orderId,
            statusId: 2
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === orderId);
                        order.statusId = dataBody.statusId
                        return [...prev]
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => { notification("error", "Thất bại", "Đã có lỗi xảy ra.") })
    }

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
    const showModalViewFeedback = () => {
        setIsModalViewFeedbackOpen(true);
    };
    const handleViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }

    return (<div >
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
                                    onOrderComplete={() => handleOrderComplete(v.orderId, v.shopId)}
                                    onOrderComplaint={() => handleOrderComplaint(v.orderId, v.shopId)}
                                    onFeedback={handleCustomerFeedback}
                                />
                            </Col>
                        })}
                    </Row>
                    <Modal title="Basic Modal" open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk} onCancel={handleViewFeedbackCancel}>

                    </Modal>
                </>
                :
                <Empty />
            :
            null
        }

    </div>);
}

export default AllOrder;