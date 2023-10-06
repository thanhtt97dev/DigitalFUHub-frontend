import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Row, Space, Tag } from 'antd';
import { getOrderDetail } from '~/api/seller';
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES
} from "~/constants";
import { ParseDateTime, formatStringToCurrencyVND } from '~/utils';


function DrawerSellerDetailOrder({ orderId, isOpen, setOpenDrawer }) {
    const [placement] = useState('right');
    const [order, setOrder] = useState();
    useEffect(() => {
        getOrderDetail(orderId)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                } else {

                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    const onClose = () => {
        setOpenDrawer(false);
    };
    const getTagStatus = (statusId) => {
        if (statusId === ORDER_WAIT_CONFIRMATION) {
            return <Tag color="#108ee9">Chờ xác nhận</Tag>
        } else if (statusId === ORDER_CONFIRMED) {
            return <Tag color="#87d068">Đã xác nhận</Tag>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Tag color="#c6e329">Khiếu nại</Tag>
        } else if (statusId === ORDER_DISPUTE) {
            return <Tag color="#ffaa01">Tranh chấp</Tag>
        } else if (statusId === ORDER_REJECT_COMPLAINT) {
            return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
        } else if (statusId === ORDER_SELLER_VIOLATES) {
            return <Tag color="#f50">Người bán vi phạm</Tag>
        }
    }
    return (
        <>
            <Drawer
                title="Chi tiết đơn hàng"
                placement={placement}
                width={600}
                onClose={onClose}
                open={isOpen}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <Row>
                    <Col span={6} offset={1}><label>Mã đơn </label></Col>
                    <Col span={10}>
                        <div>: {order?.orderId}</div>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={1}><label>Email </label></Col>
                    <Col span={10}>
                        <div>: {order?.emailCustomer}</div>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={1}><label>Thời gian đặt </label></Col>
                    <Col span={10}>
                        <div>: {ParseDateTime(order?.orderDate)}</div>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={1}><label>Trạng thái </label></Col>
                    <Col span={10}>
                        : {getTagStatus(order?.orderStatusId)}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={1}><label>Các sản phẩm: </label></Col>
                </Row>
                {order?.products.map((value, index) => (
                    <Row key={index} gutter={[8, 8]}>
                        <Col offset={1}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                            }}>
                                <img src={value.thumbnail} style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }} alt='' />
                            </div>
                        </Col>
                        <Col offset={1}><span>{value.productName}</span></Col>
                        <Col offset={1}>
                            {value.productVariants.map((v, i) => (
                                <div key={i}>{v.name}</div>
                            ))}
                        </Col>
                        <Col offset={1}>
                            {value.productVariants.map((v, i) => (
                                <div key={i}>x{v.quantity}</div>
                            ))}
                        </Col>
                        <Col offset={1}>
                            {value.productVariants.map((v, i) => (
                                <div key={i}>{formatStringToCurrencyVND(v.price)}VNĐ</div>
                            ))}
                        </Col>
                    </Row>
                ))}
            </Drawer>
        </>
    );
};
export default DrawerSellerDetailOrder;