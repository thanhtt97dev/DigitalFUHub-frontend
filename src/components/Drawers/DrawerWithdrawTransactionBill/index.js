import React, { useState } from "react";

import { Button, Drawer, notification, Descriptions } from "antd";

import Spinning from "~/components/Spinning";
import { getWithdrawTransactionBill } from '~/api/bank'
import { RESPONSE_CODE_SUCCESS } from '~/constants'
import { ParseDateTime, formatStringToCurrencyVND } from '~/utils/index'

function DrawerWithdrawTransactionBill({ withdrawTransactionId }) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const [items, setItems] = useState({})

    const handleOpenDrawer = () => {
        setOpen(true)
        getWithdrawTransactionBill(withdrawTransactionId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const data = res.data.result
                    setItems([
                        {
                            key: '1',
                            label: 'Mã giao dịch',
                            children: data.withdrawTransactionId,
                            span: 3
                        },
                        {
                            key: '2',
                            label: 'Đơn vị thụ hưởng',
                            children: data.benAccountName,
                            span: 3
                        },
                        {
                            key: '3',
                            label: 'Số tài khoản',
                            children: data.benAccountNo,
                            span: 3
                        },
                        {
                            key: '4',
                            label: 'Ngân hàng',
                            children: data.bankName,
                            span: 3
                        },
                        {
                            key: '5',
                            label: 'Số tiền',
                            children: <p>{formatStringToCurrencyVND(data.debitAmount)} VND</p>,
                            span: 3
                        },
                        {
                            key: '6',
                            label: 'Số bút toán',
                            children: data.refNo,
                            span: 3
                        },
                        {
                            key: '7',
                            label: 'Thời gian chuyển khoản',
                            children: ParseDateTime(data.postingDate),
                            span: 3
                        },
                        {
                            key: '8',
                            label: 'Nội dung chuyển khoản',
                            children: data.description,
                            span: 3
                        },
                    ])
                } else {
                    openNotification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                openNotification("error", "Hệ thống đang gặp sự cố! Hãy thử sau!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }

    return (
        <>
            {contextHolder}
            <Button type="link" onClick={handleOpenDrawer}>
                Chi tiết
            </Button>
            <Drawer
                title="Chi tiết thông tin chuyển khoản"
                placement={"right"}
                open={open}
                onClose={() => { setOpen(false) }}
                width={400}
            >
                <Spinning spinning={loading}>
                    <Descriptions layout="horizontal" items={items} />
                </Spinning>
            </Drawer>
        </>
    );
}

export default DrawerWithdrawTransactionBill;