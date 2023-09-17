import React, { useLayoutEffect, useRef, useState } from "react";

import { BANKS_INFO } from "~/constants";

import classNames from 'classnames/bind';
import styles from './UserBankAccountInfo.module.scss';
import { Divider } from "antd";

const cx = classNames.bind(styles)

function UserBankAccountInfo({ userBank }) {

    const [bank, setBank] = useState(null)
    const [getDataSuccess, setGetDataSuccess] = useState(false)

    var bankInfo = BANKS_INFO.filter(x => x.id == userBank.bankId)[0];


    useLayoutEffect(() => {
        if (bankInfo !== null || bankInfo !== undefined) {
            setBank(bankInfo)
            setGetDataSuccess(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bankInfo])



    return (
        <>
            {getDataSuccess ?
                <div className={cx("info")}>
                    <img className={cx("bank-image")} src={bank.image} alt="bank" />
                    <div className={cx("bank-user-info")}>
                        <h3 className={cx("bank-name")}>{bank.name}</h3>
                        <div className={cx("bank-user-info-field")}>
                            <span className={cx("lable")}>Họ và tên : </span>
                            <p className={cx("credit-account-name")}>{userBank.creditAccountName}</p>
                        </div>
                        <div className={cx("bank-user-info-field")}>
                            <span className={cx("lable")}>Số tài khoản: </span>
                            <p className={cx("credit-account")}>{userBank.creditAccount}</p>
                        </div>
                    </div>
                </div>
                :
                ""
            }
        </>
    );
}

export default UserBankAccountInfo;

/*

*/