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
        customerEmail: '',
        userId: getUserId(),
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getOrdersSeller(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
            name: 'customerEmail',
            value: searchData.customerEmail,
        },
        {
            name: 'shopName',
            value: searchData.shopName,
        },
        {
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            notification("error", "Thời gian đơn hàng không được trống!")
            setLoading(false);
            return;
        }
        setSearchData({
            orderId: values.orderId,
            customerEmail: values.customerEmail,
            userId: getUserId(),
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
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
                            <Col span={3} offset={1}><label>Email khách hàng: </label></Col>
                            <Col span={6}>
                                <Form.Item name="customerEmail" >
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
                            title="Email khách hàng"
                            key="emailCustomer"
                            render={(_, record) => (
                                <Link to={`/seller/order/${record.customerEmail}`}>{record.customerEmail}</Link>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Tên cửa hàng"
                            key="shopname"
                            render={(_, record) => (
                                <Link to={`/seller/${record.sellerId}`}>{record.shopName}</Link>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian đơn hàng"
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
                                <p>{formatStringToCurrencyVND(record.totalAmount)}</p>
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
                                <Link to={`/seller/order/${record.orderId}`}>
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