import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { getAllOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

function OrdersDispute({ status, loading, setLoading }) {
    const [paramSearch, setParamSearch] = useState({
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
            getAllOrdersCustomer(paramSearch)
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

export default OrdersDispute;