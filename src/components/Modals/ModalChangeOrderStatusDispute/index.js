import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, Row, Col, Input } from "antd";
import { useAuthUser } from "react-auth-kit";

import { ExclamationCircleFilled } from "@ant-design/icons";

import {
    RESPONSE_CODE_SUCCESS,
    CUSTOMER_ROLE,
    SELLER_ROLE,
    RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE
} from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";

import { updateDisputeOrder } from '~/api/order'

const { TextArea } = Input;


function ModalChangeOrderStatusDispute({ orderId, customerId, shopId, style, callBack }) {

    var auth = useAuthUser();
    var user = auth();
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)


    useEffect(() => {
        if (user === null) return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = () => {
        setConfirmLoading(true)
        form.submit();
        var data = form.getFieldsValue()
        if (data.note === "") {
            setConfirmLoading(false)
            return;
        }

        // // call api
        const bodyDataRequest = {
            customerId: customerId,
            sellerId: shopId,
            orderId: orderId,
            note: data.note
        }
        updateDisputeOrder(bodyDataRequest)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    callBack();
                    notification("success", "Đơn hàng được chuyển sang tranh chấp, vui lòng vào chat để người quản lý giải quyết.");
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                }
            })
            .catch((err) => { notification("error", "Đã có lỗi xảy ra."); })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false)
                }, 500)
            })
    }

    const handleOpenModal = () => {
        setBtnLoading(false)
        setOpenModal(true)
        //checking user has been linked bank account

    }

    const initFormValues = [
        {
            name: 'note',
            value: ''
        },
    ];


    return (
        <>
            <Button danger onClick={handleOpenModal}
                type="primary"
                style={style}
                loading={btnLoading}>
                {(() => {
                    if (user.roleName === CUSTOMER_ROLE) {
                        return "Khiếu nại"
                    } else if (user.roleName === SELLER_ROLE) {
                        return "Tranh chấp"
                    } else {
                        return;
                    }
                })()}
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} />Bạn có chắc chắn muốn tranh chấp đơn hàng không?</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"35%"}
            >
                <>
                    {/* <Divider />
                    <b style={{ marginLeft: "20px" }}>
                        Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng là khiếu nại không?
                    </b> */}
                    <Form
                        name="basic"
                        form={form}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col offset={1} span={23}>
                                <Form.Item name="note" label={"Lý do"}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Lý do không được để trống'
                                        }
                                    ]}
                                >
                                    <TextArea rows={4} placeholder="Nhập thông tin lý do chỉnh sửa trạng thái đơn hàng" maxLength={200} />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                </>

            </Modal>
        </>)
}

export default ModalChangeOrderStatusDispute;
