import { Col, Empty, Row } from "antd";
import CardOrderItem from "../CardOrderItem";
import { useEffect, useState } from "react";
import { getUserId } from "~/utils";
import { getOrders } from "~/api/order";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

function AllOrder({ status = 0 }) {
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
            getOrders(paramSearch)
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders(res.data.result.orders);
                        setNextOffset(res.data.result.nextOffset);
                    }
                })
                .catch(err => { })
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
    return (<div >
        {orders.length <= 0 ?
            <Row gutter={[0, 16]} style={{ padding: '0 50px' }}>
                {orders.map((v, i) => {
                    const id = String(i + 1);
                    return <Col span={24}>
                        <CardOrderItem key={id}
                            productName={v.productName}
                            productId={v.productId}
                            price={v.price}
                            quantity={v.quantity}
                            shopId={v.shopId}
                            shopname={v.shopName}
                            variantName={v.ProductVariantName}
                            thumbnail={v.thumbnail}
                            status={v.statusId}
                            discount={v.discount}
                            couponDiscount={v.couponDiscount}
                            isFeedback={v.isFeedback}
                        />
                    </Col>
                })}
                {new Array(18).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    return <Col span={24}>
                        <CardOrderItem key={id}
                            productName={"Tài khoản xem phim netflix"}
                            price={20000}
                            quantity={5}
                            discount={20}
                            couponDiscount={10}
                            shopname="Shop Online"
                            variantName="30 ngày"
                            thumbnail="https://treobangron.com.vn/wp-content/uploads/2022/09/background-dep-5-2.jpg"
                            status={2}
                        />
                    </Col>
                })}
            </Row>
            :
            <Empty />
        }

    </div>);
}

export default AllOrder;