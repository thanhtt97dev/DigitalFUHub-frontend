import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, Select, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { getOrdersSeller } from '~/api/order'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, getUserId, ParseDateTime } from '~/utils/index'
import { NotificationContext } from "~/context/NotificationContext";
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES
} from "~/constants";
import Column from "antd/es/table/Column";

const { RangePicker } = DatePicker;

function Orders() {
    const notification = useContext(NotificationContext)
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        orderId: '',
        username: '',
        userId: getUserId(),
        fromDate: null,
        toDate: null,
        status: 0
    });

    useEffect(() => {
        getOrdersSeller(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const initFormValues = [
        {
            name: 'orderId',
            value: searchData.orderId,
        },
        {
            name: 'username',
            value: searchData.username,
        },
        {
            name: 'date',
            value: [searchData.fromDate !== null ? dayjs(searchData.fromDate, 'M/D/YYYY') : null, searchData.toDate !== null ? dayjs(searchData.toDate, 'M/D/YYYY') : null]
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        // if (values.date === null) {
        //     notification("error", "Thời gian đơn hàng không được trống!")
        //     setLoading(false);
        //     return;
        // }
        setSearchData({
            orderId: values.orderId,
            username: values.username,
            userId: getUserId(),
            fromDate: values.date && values.date[0] ? values.date[0].$d.toLocaleDateString() : null,
            toDate: values.date && values.date[1] ? values.date[1].$d.toLocaleDateString() : null,
            status: values.status
        });
    };

    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        minHeight: "690px"
                    }}
                    title="Lịch sử các đơn hàng"
                >
                    <Form
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={3} offset={1}><label>Mã đơn: </label></Col>
                            <Col span={6}>
                                <Form.Item name="orderId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Người mua: </label></Col>
                            <Col span={6}>
                                <Form.Item name="username" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian đơn hàng: </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Trạng thái: </label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Chờ xác nhận</Select.Option>
                                        <Select.Option value={2}>Đã xác nhận</Select.Option>
                                        <Select.Option value={3}>Khiếu nại</Select.Option>
                                        <Select.Option value={4}>Tranh chấp</Select.Option>
                                        <Select.Option value={5}>Từ chối khiếu nại</Select.Option>
                                        <Select.Option value={6}>Người bán vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Tìm kiếm
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                    <Table
                        rowKey={(record) => record.orderId}
                        dataSource={dataTable} size='small' scroll={{ y: 290 }}
                    >
                        <Column
                            width="9%"
                            title="Mã đơn hàng"
                            key="orderId"
                            render={(_, record) => (
                                <Link to={`/seller/order/${record.orderId}`}>{record.orderId}</Link>
                            )}
                        />
                        <Column
                            width="20%"
                            title="Người mua"
                            key="username"
                            render={(_, record) => (
                                <p>{record.username}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian mua"
                            key="orderDate"
                            render={(_, record) => (
                                <p>{ParseDateTime(record.orderDate)}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Số tiền"
                            key="totalAmount"
                            render={(_, record) => (
                                <p>{formatStringToCurrencyVND(record.totalAmount - record.totalCouponDiscount)}₫</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Trạng thái"
                            key="orderStatusId"

                            render={(_, record) => {
                                if (record.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                                    return <Tag color="#108ee9">Chờ xác nhận</Tag>
                                } else if (record.orderStatusId === ORDER_CONFIRMED) {
                                    return <Tag color="#87d068">Đã xác nhận</Tag>
                                } else if (record.orderStatusId === ORDER_COMPLAINT) {
                                    return <Tag color="#c6e329">Khiếu nại</Tag>
                                } else if (record.orderStatusId === ORDER_DISPUTE) {
                                    return <Tag color="#ffaa01">Tranh chấp</Tag>
                                } else if (record.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                    return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
                                } else if (record.orderStatusId === ORDER_SELLER_VIOLATES) {
                                    return <Tag color="#f50">Người bán vi phạm</Tag>
                                }
                            }}
                        />
                        <Column
                            width="9%"
                            key="orderId"
                            render={(_, record) => (
                                <Link to={`/seller/order/${record.orderId}`} >
                                    <Button type="primary">Chi tiết</Button>
                                </Link>
                            )}
                        />
                    </Table>
                </Card>

            </Spinning>
        </>
    )
}

export default Orders;