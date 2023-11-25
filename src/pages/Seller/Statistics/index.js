import { Col, Row } from "antd";
import { LineChart } from "~/components/Seller/Statistics/LineChart";
import SalesSummaryCurrentMonth from "~/components/Seller/Statistics/SalesSummaryCurrentMonth";
import TodoList from "~/components/Seller/Statistics/TodoList";

function Statistics() {
    return (<>
        <Row gutter={[8, 16]}>
            <Col span={24}>
                <SalesSummaryCurrentMonth />
            </Col>
            <Col span={24}>
                <TodoList />
            </Col>
            <Col span={24}>
                <LineChart />
            </Col>
        </Row>
    </>);
}

export default Statistics;