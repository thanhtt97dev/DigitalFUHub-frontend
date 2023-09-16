import React, { useEffect, useState } from "react";
import { Divider, notification, Space } from "antd";
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

import { testConnect, getUserBankAccount } from '~/api/bank'

import classNames from 'classnames/bind';
import styles from './BankAccount.module.scss';
import { getUserId } from "~/utils";
import ModalAddBankAccount from "~/components/ModalAddBankAccount";

const cx = classNames.bind(styles)

function BankAccount() {

    const [api, contextHolder] = notification.useNotification();

    const userId = getUserId();
    const [canView, setCanView] = useState(false);
    const [userBank, setUserBank] = useState(null);

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    // check can connect with MB bank
    useEffect(() => {
        testConnect()
            .then(() => {
                setCanView(true)
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    // get data
    useEffect(() => {
        getUserBankAccount(userId)
            .then((res) => {
                setUserBank(res.data)
            })
            .catch((err) => {
                // 404 is mean user dont have account
                if (err.response.status !== 404) {
                    openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canView])


    return (
        <>
            {contextHolder}

            <h2 className={cx("title")}>Tài khoản ngân hàng</h2>
            <Divider />
            <div>
                {canView ?
                    <>
                        {userBank != null ?
                            <>hei</>
                            :
                            <>
                                <div className={cx('ml-30')}>
                                    <div className={cx("text-unlinked-bank")}>
                                        <Space>
                                            <CloseCircleFilled className={cx('text-message-err')} />
                                            <p className={cx("fontSize-20")}> Bạn chưa có tài khỏa ngân hàng.</p>
                                        </Space>
                                    </div>

                                    <ModalAddBankAccount userId={userId} />
                                </div>
                            </>
                        }
                    </>
                    :
                    ""
                }
                <div className={cx('warning-info')}>
                    <h4 className={cx('text-message-err')}>Lưu ý:</h4>
                    <li><i>Thực hiện thêm tài khoản ngân hàng nhằm giúp bạn có thể rút tiền từ số dư tại </i> <span>DigitalFUHub</span>.</li>
                    <li><i>Vui lòng sử dụng đúng tài khoản ngân hàng của bạn</i></li>
                    <li><i>Bạn hãy cân nhắc nếu muốn sử dụng tài khỏa ngân hàng của người khác mà không phải của bạn</i></li>
                    <li><i>Chúng tôi sẽ không giải quyết những tranh chấp trong tương lai nếu bạn sử dụng tài khoản ngân hàng của người khác </i></li>
                </div>
            </div>

        </>
    )
}

export default BankAccount;