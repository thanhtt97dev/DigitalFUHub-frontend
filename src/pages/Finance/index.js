import React, { useState } from "react";

import { Card } from "antd";
import HistoryDeposit from "./HistoryDeposit";
import HistoryWithdraw from "./HistoryWithdraw";

function Finance() {
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



    return (
        <>
            <Card
                style={{
                    width: '100%',
                }}
                tabList={initialTabList}
                activeTabKey={tabKey}
                onTabChange={handleTabChange}
                type="inner"
            >
                {contentList[tabKey]}
            </Card>
        </>
    )
}

export default Finance;