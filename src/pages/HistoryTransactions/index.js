import React, { useState } from "react";

import { Card } from "antd";
import HistoryDeposit from "~/components/HistoryTransactions/HistoryDeposit";
import HistoryWithdraw from "~/components/HistoryTransactions/HistoryWithdraw";

function HistoryTransactions() {
    const initialTabList = [
        {
            key: 'tab1',
            tab: 'Lịch sử nạp tiền',
        },
        {
            key: 'tab2',
            tab: 'Lịch sử rút tiền',
        }
    ];
    const [tabKey, setTabKey] = useState('tab1');
    const handleTabChange = (key) => {
        setTabKey(key);
    };
    const contentList = {
        tab1: (<HistoryDeposit />),
        tab2: (<HistoryWithdraw />),
    };



    const [tabList, setTabList] = useState(initialTabList);

    return (
        <>
            <Card
                style={{
                    width: '100%',
                }}
                tabList={tabList}
                activeTabKey={tabKey}
                onTabChange={handleTabChange}
                type="inner"

            >
                {contentList[tabKey]}
            </Card>
        </>
    )
}

export default HistoryTransactions;