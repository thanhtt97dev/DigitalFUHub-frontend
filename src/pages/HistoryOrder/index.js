import { Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    AllOrder,
    OrdersComplaint,
    OrdersRejectComplaint,
    OrdersWaitConfirm,
    OrdersRefund,
    OrdersConfirmed,
    OrdersDispute
} from '~/components/HistoryOrder'

const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Đã xác nhận",
        key: "tab2",
    },
    {
        label: "Chờ xác nhận",
        key: "tab3",
    },
    {
        label: "Khiếu nại",
        key: "tab4",
    },
    {
        label: "Tranh chấp",
        key: "tab5",
    },
    {
        label: "Từ chối khiếu nại",
        key: "tab6",
    },

    {
        label: "Trả hàng/Hoàn tiền",
        key: "tab7",
    }
]

function HistoryOrder() {
    const [loading, setLoading] = useState(true);
    const [activeTabKey, setActiveTabKey] = useState('tab1');
    const handleActiveTabKey = (key) => {
        setActiveTabKey(key);
        setLoading(true);
    }
    const contentList = {
        tab1: <AllOrder status={[0]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab2: <OrdersConfirmed status={[2]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab3: <OrdersWaitConfirm status={[1]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab4: <OrdersComplaint status={[3]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab5: <OrdersDispute status={[5]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab6: <OrdersRejectComplaint status={[6]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />,
        tab7: <OrdersRefund status={[4, 7]} onActiveTabKey={handleActiveTabKey} loading={loading} setLoading={setLoading} />
    };

    const onTabChange = (key) => {
        setActiveTabKey(key);
        setLoading(true);
    };
    return (<Card
        style={{
            width: '100%',
            minHeight: '100vh'
        }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
    >
        <Spin spinning={loading}>
            {contentList[activeTabKey]}
        </Spin>
    </Card>
    );
}

export default HistoryOrder;