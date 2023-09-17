import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Divider, notification, Modal, Button, Input, Select, Form, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { BANKS_INFO } from "~/constants";
import { inquiryAccountName, addBankAccount, testConnect } from '~/api/bank'

import classNames from 'classnames/bind';
import styles from './ModalAddBankAccount.module.scss';
const cx = classNames.bind(styles)

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 15,
    },
};

const bankOptions = []
BANKS_INFO.forEach((bank) => {
    let bankOption = {
        value: bank.id,
        name: bank.name,
        label: <div><img src={bank.image} className={cx("option-images-display")} alt={bank.name} /> <p className={cx("option-text-display")}>{bank.name}</p></div>
    }
    bankOptions.push(bankOption)
})

function ModalAddBankAccount({ userId }) {

    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    ///DTO for body of api "addBankAccount"
    const [bankAccoutRequest, setBankAccoutRequest] = useState({
        userId: "",
        bankId: "",
        creditAccount: ""
    })

    const [bankAccountName, setBankAccountName] = useState("")

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loadingBtnCheckAccount, setLoadingBtnCheckAccount] = useState(false);
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false)

    const [disableInput, setDisableInput] = useState(false);

    useEffect(() => {
        if (userId === null) {
            openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            return navigate("/settings")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const filterOptions = (inputValue, option) => {
        return option.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
    }


    const handleCheckBankAccount = (values) => {
        setLoadingBtnCheckAccount(true)
        const data = { bankId: values.bankId, creditAccount: values.creditAccount }
        inquiryAccountName(data)
            .then((res) => {
                setBankAccountName(res.data)
                setBankAccoutRequest({
                    userId: userId,
                    bankId: values.bankId,
                    creditAccount: values.creditAccount
                })
                setDisableInput(true)
            })
            .catch((err) => {
                if (err.response.status === 409) {
                    openNotification("error", "Tài khoản ngân hàng không tồn tại!")
                    return;
                }
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingBtnCheckAccount(false)
                }, 500)
            })
    }


    const handleSubmit = () => {
        if (!disableInput) {
            openNotification("error", "Bạn chư điền đủ thông tin! Hãy thử lại!")
            return;
        }

        setLoadingBtnSubmit(true)
        addBankAccount(bankAccoutRequest)
            .then((res) => {
                setOpenModal(false)
                openNotification("success", "Liên kết tài khoản ngân hàng thành công!")
                window.location.reload();
            })
            .catch(() => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setConfirmLoading(false)
                setTimeout(() => {
                    setLoadingBtnSubmit(false)
                }, 500)
            })
    }

    // check can connect with MB bank
    const handleOpenModalBankAccount = () => {
        testConnect()
            .then(() => {
                setOpenModal(true)
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
    }


    return (
        <>
            {contextHolder}

            <Button
                type="primary"
                style={{ background: "#28a745" }}
                loading={confirmLoading}
                size="large"
                onClick={handleOpenModalBankAccount}
            >
                + Thêm tài khoản ngân hàng
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Liên kết tài khoản ngân hàng</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={loadingBtnSubmit}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"40%"}
            >

                <>
                    <Divider />

                    <Form
                        {...layout}
                        name="control-hooks"
                        onFinish={handleCheckBankAccount}
                    >
                        <Form.Item
                            name="bankId"
                            label="Ngân hàng thụ hưởng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Ngân hàng thụ hưởng không hợp lệ!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Ngân hàng thụ hưởng"
                                optionFilterProp="children"
                                Select={Select}
                                options={bankOptions}
                                filterOption={filterOptions}
                                disabled={disableInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name="creditAccount"
                            label="Số tài khoản"
                            rules={[
                                {
                                    required: true,
                                    message: 'Số tài khoản không hợp lệ!',
                                },
                            ]}
                        >
                            <Space>
                                <Input disabled={disableInput} />
                                <Button htmlType="submit" loading={loadingBtnCheckAccount}> Kiểm tra</Button>
                            </Space>

                        </Form.Item>
                        <div>
                            <span className={cx("bank-account-name__lable")}>Tên tài khoản:</span>
                            <Input className={cx("bank-account-name__input")} value={bankAccountName} disabled />
                        </div>
                    </Form>
                </>

            </Modal>
        </>)
}

export default ModalAddBankAccount;
