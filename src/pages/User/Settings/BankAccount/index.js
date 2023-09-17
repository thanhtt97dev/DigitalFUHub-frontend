import React, { useEffect, useState } from "react";
import { Divider, notification, Space } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

import { getUserBankAccount, testConnect } from '~/api/bank'

import { getUserId } from "~/utils";
import ModalAddBankAccount from "~/components/ModalAddBankAccount";
import UserBankAccountInfo from "~/components/UserBankAccountInfo";

import classNames from 'classnames/bind';
import styles from './BankAccount.module.scss';
import SpinningPage from "~/components/Spinning";
const cx = classNames.bind(styles)


function BankAccount() {

    const [api, contextHolder] = notification.useNotification();

    const userId = getUserId();
    const [userBank, setUserBank] = useState(null);
    const [getUserBankInfoSuccess, SetGetUserBankInfoSuccess] = useState(false);
    const [canConnectWithMbBank, setCanConnectWithMbBank] = useState(false)
    const [showWarningMbBankText, setShowWarningMbBankText] = useState(false)


    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    // get data
    useEffect(() => {

        testConnect()
            .then(() => {
                setCanConnectWithMbBank(true)
                getUserBankAccount(userId)
                    .then((res) => {
                        setUserBank(res.data)
                        console.log(res)
                        setTimeout(() => {
                            SetGetUserBankInfoSuccess(true)
                        }, 500)
                    })
                    .catch(() => {
                        openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
                    })
            })
            .catch(() => {
                setShowWarningMbBankText(true)
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            {contextHolder}

            <h2 className={cx("title")}>Tài khoản ngân hàng</h2>
            <Divider />
            <div>
                {canConnectWithMbBank ?
                    <>
                        {userBank !== "" ?
                            <>
                                {getUserBankInfoSuccess ?

                                    <>
                                        <UserBankAccountInfo userBank={userBank} />
                                        <div className={cx('warning-info')}>
                                            <h4 className={cx('text-message-err')}>Lưu ý:</h4>
                                            <li><i>Thực hiện thêm tài khoản ngân hàng nhằm giúp bạn có thể rút tiền từ số dư tài khoản của bạn trong </i> <span>DigitalFUHub</span>.</li>
                                            <li><i>Vui lòng sử dụng đúng tài khoản ngân hàng của bạn</i></li>
                                            <li><i>Bạn hãy cân nhắc nếu muốn sử dụng tài khoản ngân hàng của người khác mà không phải của bạn</i></li>
                                            <li><i>Chúng tôi sẽ không giải quyết những tranh chấp trong tương lai nếu bạn sử dụng tài khoản ngân hàng của người khác </i></li>
                                        </div>
                                    </>
                                    :
                                    <SpinningPage />
                                }
                            </>
                            :
                            <>
                                <div className={cx('ml-30')}>
                                    <div className={cx("text-unlinked-bank")}>
                                        <Space>
                                            <CloseCircleFilled className={cx('text-message-err')} />
                                            <p className={cx("fontSize-20")}> Bạn chưa có tài khỏan ngân hàng.</p>
                                        </Space>
                                    </div>
                                    <ModalAddBankAccount userId={userId} />

                                    <div className={cx('warning-info')}>
                                        <h4 className={cx('text-message-err')}>Lưu ý:</h4>
                                        <li><i>Thực hiện thêm tài khoản ngân hàng nhằm giúp bạn có thể rút tiền từ số dư tài khoản của bạn trong </i> <span>DigitalFUHub</span>.</li>
                                        <li><i>Vui lòng sử dụng đúng tài khoản ngân hàng của bạn</i></li>
                                        <li><i>Bạn hãy cân nhắc nếu muốn sử dụng tài khoản ngân hàng của người khác mà không phải của bạn</i></li>
                                        <li><i>Chúng tôi sẽ không giải quyết những tranh chấp trong tương lai nếu bạn sử dụng tài khoản ngân hàng của người khác </i></li>
                                    </div>
                                </div>
                            </>
                        }
                    </>
                    :
                    <>
                        {showWarningMbBankText ?
                            <div className={cx("text-connect-err")}>
                                <p>Hiện tại đang xảy ra một vài sự cố!</p>
                                <p>Vui lòng thử lại sau!</p>
                            </div>
                            :
                            ""
                        }
                    </>

                }



            </div>

        </>
    )
}

export default BankAccount;