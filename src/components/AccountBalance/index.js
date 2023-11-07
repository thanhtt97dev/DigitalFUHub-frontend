import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { Space } from 'antd';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { getCustomerBalance } from '~/api/user';
import { getUserId, formatPrice } from '~/utils';

function AccountBalance() {
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const userId = getUserId();
        getCustomerBalance(userId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        if (balance !== data.result) {
                            setBalance(data.result)
                        }
                    }
                }
            }).catch((err) => {
                console.log(err.message)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Space>
                <FontAwesomeIcon icon={faCoins} style={{ fontSize: "25", color: "#e9ad03" }} />
                <p>{formatPrice(balance)} VND</p>
            </Space>
        </>
    )

}

export default AccountBalance;