import React, { useEffect, useState } from "react";

import { Card } from "antd";
import Spinning from "~/components/Spinning";

function HistoryDeposit() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {

    }, [])

    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        marginBottom: 15
                    }}
                    hoverable

                >


                </Card>
            </Spinning>
        </>
    )
}

export default HistoryDeposit;