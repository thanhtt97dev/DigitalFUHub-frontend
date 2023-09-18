import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { Space } from 'antd';

import { getCustomerBalance } from '~/api/user';
import { getUserId } from '~/utils';

function AccountBalance() {
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const userId = getUserId();
        getCustomerBalance(userId)
            .then((res) => {
                if (balance !== res.data) {
                    setBalance(res.data)
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
                <p>{balance} VND</p>
            </Space>
        </>
    )

}

export default AccountBalance;