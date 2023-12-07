import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getInfoWalletUser } from "~/api/user";
import Spinning from "~/components/Spinning";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { formatPrice } from "~/utils";

function Wallet() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getInfoWalletUser()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setData(res.data.result);
                } else {

                }
            })
            .catch(err => {

            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, [])
    return (<>
        <Card title="Thông tin ví của tôi">
            <Spinning spinning={loading}>
                {!loading
                    ?
                    <Row justify="center" gutter={32}>
                        <Col span={8}>
                            <Card title="Số dư hiện có" bordered bodyStyle={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '16px', fontWeight: 600 }}>{formatPrice(data?.accountBalance ? data?.accountBalance : 0)}</span>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<div>Số xu hiện có <Tooltip title="Có thể kiếm xu từ đánh giá sản phẩm của đơn hàng."><QuestionCircleOutlined /></Tooltip></div>} bordered bodyStyle={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '16px', fontWeight: 600 }}>{data?.coin ? data?.coin : 0} xu</span>
                            </Card>
                        </Col>
                    </Row>
                    :
                    null
                }
            </Spinning>
        </Card>
    </>);
}

export default Wallet;