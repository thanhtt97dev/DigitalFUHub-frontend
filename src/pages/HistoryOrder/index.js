import { Tabs } from "antd";
import AllOrder from "~/components/HistoryOrder/AllOrder";
import Refund from "~/components/HistoryOrder/Refund";

const items = [
    {
        label: "Tất cả",
        key: 0,
        children: AllOrder
    },
    {
        label: "Đã xác nhận",
        key: 2,
        children: Refund
    },
    {
        label: "Chờ xác nhận",
        key: 1,
        children: Refund
    },
    {
        label: "Khiếu nại",
        key: 3,
        children: Refund
    },
    {
        label: "Tranh chấp",
        key: 5,
        children: Refund
    },
    {
        label: "Từ chối khiếu nại",
        key: 6,
        children: Refund
    },

    {
        label: "Trả hàng/Hoàn tiền",
        key: 7,
        children: Refund
    }
]

function HistoryOrder() {
    return (<Tabs
        type="card"
        size="large"
        items={items.map((v, i) => {
            const Component = v.children
            return {
                label: v.label,
                key: i,
                children: <Component status={v.key} />
            };
        })}
    />);
}

export default HistoryOrder;