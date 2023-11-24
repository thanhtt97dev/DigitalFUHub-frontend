import { ArrowUpOutlined, StarOutlined } from "@ant-design/icons";
import { Card, Col, Row, Space, Statistic } from "antd";
import { LineChart } from "~/components/Seller/Statistics/LineChart";
import { formatPrice } from "~/utils";

function Statistics() {
    return (<>
        <Row gutter={[8, 16]}>
            <Col span={24}>
                <Space>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={formatPrice(1000000)}
                            precision={2}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                        // prefix={<StarOutlined />}
                        // suffix={<StarOutlined />}
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title="Điểm đánh giá"
                            value={4.9}
                            precision={2}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            // prefix={<StarOutlined />}
                            suffix={<StarOutlined />}
                        />
                    </Card>
                </Space>
            </Col>
            <Col span={24}>
                <LineChart />
            </Col>
        </Row>
    </>);
}

export default Statistics;