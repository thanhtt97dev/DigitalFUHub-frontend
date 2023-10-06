import React, { useEffect, useState } from 'react';
import { Button, Col, Drawer, Row, Space, Table, Tag } from 'antd';
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
import Column from 'antd/es/table/Column';


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
            return <Tag style={{ fontSize: '16px' }} color="#108ee9">Chờ xác nhận</Tag>
        } else if (statusId === ORDER_CONFIRMED) {
            return <Tag style={{ fontSize: '16px' }} color="#87d068">Đã xác nhận</Tag>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Tag style={{ fontSize: '16px' }} color="#c6e329">Khiếu nại</Tag>
        } else if (statusId === ORDER_DISPUTE) {
            return <Tag style={{ fontSize: '16px' }} color="#ffaa01">Tranh chấp</Tag>
        } else if (statusId === ORDER_REJECT_COMPLAINT) {
            return <Tag style={{ fontSize: '16px' }} color="#ca01ff">Từ chối khiếu nại</Tag>
        } else if (statusId === ORDER_SELLER_VIOLATES) {
            return <Tag style={{ fontSize: '16px' }} color="#f50">Người bán vi phạm</Tag>
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
                <Row gutter={[8, 8]}>
                    <Col span={6} offset={1}><label style={{ fontSize: '16px' }}>Mã đơn </label></Col>
                    <Col span={17}>
                        <div style={{ fontSize: '16px' }}>: {order?.orderId}</div>
                    </Col>
                    <Col span={6} offset={1}><label style={{ fontSize: '16px' }}>Email </label></Col>
                    <Col span={17}>
                        <div style={{ fontSize: '16px' }}>: {order?.emailCustomer}</div>
                    </Col>
                    <Col span={6} offset={1}><label style={{ fontSize: '16px' }}>Thời gian đặt </label></Col>
                    <Col span={17}>
                        <div style={{ fontSize: '16px' }}>: {ParseDateTime(order?.orderDate)}</div>
                    </Col>
                    <Col span={6} offset={1}><label style={{ fontSize: '16px' }}>Trạng thái </label></Col>
                    <Col span={17}>
                        : {getTagStatus(order?.orderStatusId)}
                    </Col>
                    <Col span={10} offset={1}><label style={{ fontSize: '16px' }}>Thông tin sản phẩm: </label></Col>
                    <Col offset={1}>
                        <Row gutter={[8, 8]}>
                            <Col span={4} >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}>
                                    <img src={order?.thumbnail} style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }} alt='' />
                                </div>
                            </Col>
                            <Col span={5} offset={1}><span style={{ fontSize: '16px' }}>{order?.productName}</span></Col>
                            <Col span={5} offset={1}>
                                <span style={{ fontSize: '16px' }}>{order?.productVariantName}</span>
                            </Col>
                            <Col span={2} offset={1}>
                                <span style={{ fontSize: '16px' }}>x{order?.quantity}</span>
                            </Col>
                            <Col span={4} offset={1}>
                                <span style={{ fontSize: '16px' }}>{formatStringToCurrencyVND(order?.price * order?.quantity)}VNĐ</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Drawer>
        </>
    );
};
export default DrawerSellerDetailOrder;