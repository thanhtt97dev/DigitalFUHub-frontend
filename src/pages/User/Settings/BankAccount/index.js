import React, { useEffect, useState } from "react";
import { Typography, notification, Space, Card } from "antd";

import { getUserBankAccount } from '~/api/bank'

import { getUserId } from "~/utils";
import ModalAddBankAccount from "~/components/Modals/ModalAddBankAccount";
import UserBankAccountInfo from "~/components/UserBankAccountInfo";

import classNames from 'classnames/bind';
import styles from './BankAccount.module.scss';
import Spinning from "~/components/Spinning";
import ModalUpdateBankAccount from "~/components/Modals/ModalUpdateBankAccount";
const cx = classNames.bind(styles)
const { Title } = Typography;


function BankAccount() {

    const [api, contextHolder] = notification.useNotification();

    const userId = getUserId();
    const [userBank, setUserBank] = useState(null);
    const [getUserBankInfoSuccess, SetGetUserBankInfoSuccess] = useState(false);


    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    // get data
    useEffect(() => {

        getUserBankAccount(userId)
            .then((res) => {
                if (res.data.status.ok) {
                    setUserBank(res.data.result)
                }
            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => {
                    SetGetUserBankInfoSuccess(true)
                }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            {contextHolder}

            <Spinning spinning={!getUserBankInfoSuccess}>
                <Card
                    title="Tài khoản ngân hàng"
                    extra={userBank !== null ? <> <ModalUpdateBankAccount userId={userId} /></> : <><ModalAddBankAccount userId={userId} /></>}
                    style={{
                        width: '100%',
                        height: "60vh"
                    }}
                    type="inner"

                >
                    {getUserBankInfoSuccess ?
                        <>
                            {userBank !== null ?
                                <>
                                    <div className={cx("bank-account-info")}>
                                        <UserBankAccountInfo userBank={userBank} />
                                    </div>
                                </>
                                :
                                <>
                                    <div className={cx('ml-30')}>
                                        <div className={cx("text-unlinked-bank")}>
                                            <Space>
                                                <Title level={4} type="danger"> Bạn chưa thêm tài khoản ngân hàng</Title>
                                            </Space>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className={cx('warning-info')}>
                                <h4 className={cx('text-message-err')}>Lưu ý:</h4>
                                <li><i>Thực hiện thêm tài khoản ngân hàng nhằm giúp bạn có thể rút tiền từ số dư tài khoản của bạn trong </i> <span>DigitalFUHub</span>.</li>
                                <li><i>Vui lòng sử dụng đúng tài khoản ngân hàng của bạn</i></li>
                                <li><i>Bạn hãy cân nhắc nếu muốn sử dụng tài khoản ngân hàng của người khác mà không phải của bạn</i></li>
                                <li><i>Chúng tôi sẽ không giải quyết những tranh chấp trong tương lai nếu bạn sử dụng tài khoản ngân hàng của người khác </i></li>
                            </div>
                        </>
                        :
                        ""
                    }
                </Card>

            </Spinning>

        </>
    )
}

export default BankAccount;