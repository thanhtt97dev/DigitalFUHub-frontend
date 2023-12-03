import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row, Spin } from "antd";
import { useEffect, useState, useContext, useRef } from "react";
import { getUserId } from "~/utils";
import { customerUpdateStatusOrder, getListOrdersCustomer } from "~/api/order";
import { ORDER_CONFIRMED, RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE, RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";

function OrdersWaitConfirm({ status, loading, setLoading, onActiveTabKey = () => { } }) {
    const notification = useContext(NotificationContext);
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: status
    });
    const [orders, setOrders] = useState([]);
    const nextOffset = useRef(0)
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
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

    const handleOrderComplaint = (orderId, shopId) => {
        // setOrders(prev => {
        //     const order = prev.find((value) => value.orderId === orderId);
        //     order.statusId = ORDER_COMPLAINT
        //     return [...prev]
        // })
        notification("success", "Đơn hàng đang được khiếu nại.")
        onActiveTabKey('tab4');
    }

    const handleOrderComplete = (orderId, shopId) => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: shopId,
            orderId: orderId,
            statusId: ORDER_CONFIRMED
        }
        setLoadingButton(true);
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        // const order = prev.find((value) => value.orderId === orderId);
                        // order.statusId = dataBody.statusId
                        // return [...prev]
                        notification("success", "Xác nhận đơn hàng thành công.")
                        onActiveTabKey("tab2")
                    })
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi, vui lòng tải lại trang.")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoadingButton(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
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
                                conversationId={v.conversationId}
                                statusId={v.statusId}
                                totalAmount={v.totalAmount}
                                totalCoinDiscount={v.totalCoinDiscount}
                                totalCouponDiscount={v.totalCouponDiscount}
                                totalPayment={v.totalPayment}
                                loadingButton={loadingButton}
                                orderDetails={v.orderDetails}
                                onOrderComplete={() => handleOrderComplete(v.orderId, v.shopId)}
                                onOrderComplaint={() => handleOrderComplaint(v.orderId, v.shopId)}
                            />
                        </Col>
                    })}
                    <Col span={24}>
                        <Row justify="center" gutter={8}>
                            <Spin spinning={loadingMoreData}></Spin>
                        </Row>
                    </Col>
                </Row>
                :
                <Empty />
            :
            null
        }
    </div>);
}

export default OrdersWaitConfirm;