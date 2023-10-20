import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { getUserId } from "~/utils";
import { customerUpdateStatusOrder, getAllOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";

function OrdersComplaint({ status, loading, setLoading }) {
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
                        console.log(prev)
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
    return (<div>
        {!loading ?
            orders.length > 0 ?
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
                            />
                        </Col>
                    })}
                </Row>
                :
                <Empty />
            : null
        }
    </div>);
}

export default OrdersComplaint;