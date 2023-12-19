
import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Select, Button, Form, Input, DatePicker, Tag, Row, Col, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { NotificationContext } from "~/context/UI/NotificationContext";

import {
    getHistoryTransactionInternal,
} from '~/api/transactionInternal'

import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE,
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE
} from "~/constants";


const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'orderId',
        width: '9%',
        render: (orderId,) => {
            return (
                <Link to={`/history/order/${orderId}`}>{orderId}</Link>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'paymentAmount',
        width: '15%',
        render: (paymentAmount, record) => {
            if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <span style={{ color: "#3b7be2" }}> - {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <span style={{ color: "#cf1322" }}> + {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <span style={{ color: "green" }}> + {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE) {
                return <span style={{ color: "orange" }}> - {formatPrice(paymentAmount)}</span>
            }
        }
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'dateCreate',
        width: '15%',
        render: (dateCreate) => {
            return (
                <span>{ParseDateTime(dateCreate)}</span>
            )
        }
    },
    {
        title: 'Loại',
        dataIndex: 'transactionInternalTypeId',
        width: '15%',
        render: (transactionInternalTypeId) => {
            if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <Tag color="#3b7be2">Thanh toán</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <Tag color="#cf1322">Nhận tiền hàng</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <Tag color="#228B22">Nhận tiền hoàn khiếu nại</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE) {
                return <Tag color="orange">Phí đăng kí bán hàng</Tag>
            }
        }
    },
];

function HistoryTransaction() {
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true)

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            showSizeChanger: false
        },
    });
    const [searchData, setSearchData] = useState({
        orderId: '',
        fromDate: '',
        toDate: '',
        transactionInternalTypeId: 0,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        setLoading(true)
        getHistoryTransactionInternal(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.transactionInternals)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.total,
                        },
                    });
                    setTotalRecord(res.data.result.total)
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
            name: 'transactionInternalTypeId',
            value: searchData.transactionInternalTypeId,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            notification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            orderId: values.orderId,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            transactionInternalTypeId: values.transactionInternalTypeId,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            orderId: '',
            transactionInternalTypeId: 0,
        });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchData({
            ...searchData,
            page: pagination.current
        })
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };


    return (
        <>
            <Spinning spinning={loading}>
                <Card>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={12}>
                                <Row >
                                    <Col span={6} offset={2}>Mã hóa đơn:</Col>
                                    <Col span={12}>
                                        <Form.Item name="orderId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col span={6} offset={2}>Thời gian tạo:</Col>
                                    <Col span={12}>
                                        <Form.Item name="date" >
                                            <RangePicker locale={locale}
                                                format={"M/D/YYYY"}
                                                placement={"bottomLeft"} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={12}>
                                <Row >
                                    <Col span={6} offset={2}>Loại: </Col>
                                    <Col span={12}>
                                        <Form.Item name="transactionInternalTypeId" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Thanh toán</Select.Option>
                                                <Select.Option value={2}>Nhận tiền hàng</Select.Option>
                                                <Select.Option value={3}>Nhận tiền hoàn khiếu nại</Select.Option>
                                                <Select.Option value={TRANSACTION_INTERNAL_TYPE_SELLER_REGISTRATION_FEE}>Phí đăng kí bán hàng</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={2} offset={8}>
                                        <Space>
                                            <Button htmlType="button" onClick={onReset}>
                                                Xóa
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                Tìm kiếm
                                            </Button>
                                        </Space>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>

                </Card>

                <Card style={{ marginTop: "20px", minHeight: "80vh" }}>
                    <Row align="end">
                        <b>{totalRecord} Kết quả</b>
                    </Row>
                    <Table
                        columns={columns}
                        pagination={tableParams.pagination}
                        dataSource={dataTable}
                        rowKey={(record, index) => index}
                        onChange={handleTableChange}
                        size="middle"
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryTransaction;



