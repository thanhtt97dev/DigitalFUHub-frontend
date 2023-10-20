import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row } from "antd";
import { useEffect, useState } from "react";
import { getUserId } from "~/utils";
import { getAllOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

function OrdersRefund({ status, loading, setLoading }) {
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
                                shopName={v.shop.shopName}
                                statusId={v.statusId}
                                totalAmount={v.totalAmount}
                                totalCoinDiscount={v.totalCoinDiscount}
                                totalCouponDiscount={v.totalCouponDiscount}
                                totalPayment={v.totalPayment}
                                orderDetails={v.orderDetails}
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

export default OrdersRefund;