import { Card, Col, Row } from "antd";
import { memo, useEffect, useState } from "react";
import { getTodoList } from "~/api/statistic";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

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
                    <Card bodyStyle={{
                        textAlign: 'center'
                    }}
                    >
                        <div>{!data?.totalOrdersWaitConfirm ? 0 : data?.totalOrdersWaitConfirm}</div>
                        <div>Chờ người mua xác nhận</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bodyStyle={{
                        textAlign: 'center'
                    }}
                    >
                        <div>{!data?.totalOrdersComplaint ? 0 : data?.totalOrdersComplaint}</div>
                        <div>Đang khiếu nại</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bodyStyle={{
                        textAlign: 'center'
                    }}
                    >
                        <div>{!data?.totalOrdersDispute ? 0 : data?.totalOrdersDispute}</div>
                        <div>Đang tranh chấp</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bodyStyle={{
                        textAlign: 'center'

                    }}
                    >
                        <div>{!data?.totalProductsOutOfStock ? 0 : data?.totalProductsOutOfStock}</div>
                        <div>Sản phẩm hết hàng</div>
                    </Card>
                </Col >
            </Row>
        </Card >
    </>);
}

export default memo(TodoList);