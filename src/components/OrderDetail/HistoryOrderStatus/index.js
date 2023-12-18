/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Steps } from 'antd';
import { useLayoutEffect, useState } from 'react';
import { ORDER_COMPLAINT, ORDER_CONFIRMED, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_REFUNDED, ORDER_SELLER_VIOLATES, ORDER_WAIT_CONFIRMATION } from '~/constants';
import { ParseDateTime } from '~/utils';


const getNameStatusOrder = (statusId) => {
    switch (statusId) {
        case ORDER_WAIT_CONFIRMATION:
            return 'Chờ xác nhận';
        case ORDER_CONFIRMED:
            return 'Đã xác nhận';
        case ORDER_COMPLAINT:
            return 'Khiếu nại';
        case ORDER_DISPUTE:
            return 'Tranh chấp';
        case ORDER_REJECT_COMPLAINT:
            return 'Từ chối khiếu nại';
        case ORDER_SELLER_REFUNDED:
            return 'Hoàn trả tiền';
        case ORDER_SELLER_VIOLATES:
            return 'Người bán vi phạm';
        default: return ''
    }
}
function HistoryOrderStatus({ historyOrderStatus, current }) {
    const [historyStatus, setHistoryStatus] = useState(historyOrderStatus);
    useLayoutEffect(() => {
        if (historyStatus?.length === 1) {
            setHistoryStatus([...historyStatus,
            {
                orderId: 0,
                orderStatusId: ORDER_CONFIRMED,
                dateCreate: "",
                note: ""
            }])
        }
    }, [])
    const customDot = (dot, { index }) => {
        const note = (historyStatus.find((v, i) => i === index)).note
        return (
            <Popover
                content={note ?
                    <span>
                        Lý do: {note}
                    </span> : null
                }
            >
                {dot}
            </Popover >
        )
    };
    return (<Steps
        current={historyStatus?.findIndex(value => value.orderStatusId === current)}
        progressDot={customDot}
        items={historyStatus?.map((v, i) => ({ title: getNameStatusOrder(v.orderStatusId), description: v.dateCreate ? ParseDateTime(v.dateCreate) : '' }))}
    />
    )
};
export default HistoryOrderStatus;