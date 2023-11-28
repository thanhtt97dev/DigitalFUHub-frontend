import { Card, Col, Row } from "antd";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodoList } from "~/api/statistic";
import { ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_WAIT_CONFIRMATION, RESPONSE_CODE_SUCCESS } from "~/constants";

function TodoList() {
    const [data, setData] = useState();
    useEffect(() => {
        getTodoList()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setData(res.data.result);
                }
            })
            .catch(err => {
            })
    }, [])
    return (<>
        <Card title="Những việc cần làm" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Link to={"/seller/order/list"} state={{ status: ORDER_WAIT_CONFIRMATION }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{!data?.totalOrdersWaitConfirm ? 0 : data?.totalOrdersWaitConfirm}</div>
                            <div>Chờ người mua xác nhận</div>
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link to={"/seller/order/list"} state={{ status: ORDER_COMPLAINT }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{!data?.totalOrdersComplaint ? 0 : data?.totalOrdersComplaint}</div>
                            <div>Đang khiếu nại</div>
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link to={"/seller/order/list"} state={{ status: ORDER_DISPUTE }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{!data?.totalOrdersDispute ? 0 : data?.totalOrdersDispute}</div>
                            <div>Đang tranh chấp</div>
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link to={"/seller/product/list"}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{!data?.totalProductsOutOfStock ? 0 : data?.totalProductsOutOfStock}</div>
                            <div>Sản phẩm hết hàng</div>
                        </Card>
                    </Link>
                </Col >
            </Row>
        </Card >
    </>);
}

export default memo(TodoList);