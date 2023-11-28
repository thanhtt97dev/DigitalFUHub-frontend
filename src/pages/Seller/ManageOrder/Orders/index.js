import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, Select, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './Order.module.scss'
import { exportOrdersToExcel, getOrdersSeller } from '~/api/order'
import Spinning from "~/components/Spinning";
import { formatPrice, getUserId, ParseDateTime } from '~/utils/index'
import { NotificationContext } from "~/context/UI/NotificationContext";
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES,
    ORDER_SELLER_REFUNDED,
    ORDER_STATUS_ALL
} from "~/constants";
import Column from "antd/es/table/Column";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;
function base64ToBlob(base64String, contentType) {
    contentType = contentType || '';
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
}
function Orders() {
    const notification = useContext(NotificationContext);
    const location = useLocation();
    console.log(location)
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0)
    const [searchData, setSearchData] = useState({
        orderId: '',
        username: '',
        userId: getUserId(),
        fromDate: null,
        toDate: null,
        // fromDate: dayjs().subtract(7, 'day').format('M/D/YYYY'),
        // toDate: dayjs().format('M/D/YYYY'),
        status: location?.state ? location?.state?.status : ORDER_STATUS_ALL,
        page: page
    });

    useEffect(() => {
        getOrdersSeller(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(res.data.result.orders);
                    setTotalItems(res.data.result.totalItems);
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
        setPage(1);
        setSearchData({
            orderId: values.orderId,
            username: values.username,
            userId: getUserId(),
            fromDate: values.date && values.date[0] ? values.date[0].$d.toLocaleDateString() : null,
            toDate: values.date && values.date[1] ? values.date[1].$d.toLocaleDateString() : null,
            status: values.status,
            page: 1
        });
    };
    const handleTableChange = (pagination, filters, sorter) => {
        if (pagination.current !== page && pagination.current <= pagination.total) {
            setPage(pagination.current)
            setSearchData({
                ...searchData,
                page: pagination.current
            })
        }
    };
    const handleExportExcel = () => {
        const data = {
            userId: getUserId(),
            orderId: searchData.orderId,
            username: searchData.username,
            fromDate: searchData.fromDate,
            toDate: searchData.toDate,
            status: searchData.status
        }
        setLoading(true);
        exportOrdersToExcel(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const blob = base64ToBlob(res.data.result.fileContents, res.data.result.contentType);
                    let link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = res.data.result.fileDownloadName;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    link.remove();
                } else {
                    notification("error", "Vui lòng kiểm tra lại")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra")
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500)
            })
    }
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
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={3} offset={1}><label>Mã đơn hàng </label></Col>
                            <Col span={6}>
                                <Form.Item name="orderId" >
                                    <Input placeholder="Mã đơn hàng" />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Người mua </label></Col>
                            <Col span={6}>
                                <Form.Item name="username" >
                                    <Input placeholder="Tên đăng nhập" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian đơn hàng </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Trạng thái </label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={ORDER_STATUS_ALL}>Tất cả</Select.Option>
                                        <Select.Option value={ORDER_WAIT_CONFIRMATION}>Chờ xác nhận</Select.Option>
                                        <Select.Option value={ORDER_CONFIRMED}>Đã xác nhận</Select.Option>
                                        <Select.Option value={ORDER_COMPLAINT}>Khiếu nại</Select.Option>
                                        <Select.Option value={ORDER_DISPUTE}>Tranh chấp</Select.Option>
                                        <Select.Option value={ORDER_SELLER_REFUNDED}>Hoàn lại tiền</Select.Option>
                                        <Select.Option value={ORDER_REJECT_COMPLAINT}>Từ chối khiếu nại</Select.Option>
                                        <Select.Option value={ORDER_SELLER_VIOLATES}>Người bán vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                        Tìm kiếm
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                    <Row justify="end" style={{ marginBottom: '1em' }}>
                        <Col>
                            <Button disabled={totalItems <= 0} className={cx('btn-export-excel')} onClick={handleExportExcel} colorBgContainer icon={<FileExcelOutlined />} >
                                Xuất báo cáo
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        pagination={{
                            current: page,
                            total: totalItems,
                            pageSize: 10,
                        }}
                        rowKey={(record) => record.orderId}
                        dataSource={orders}
                        size='small'
                        scroll={{ y: 350 }}
                        onChange={handleTableChange}
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
                            width="10%"
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
                            defaultSortOrder="descend"
                            render={(_, record) => (
                                <p>{ParseDateTime(record.orderDate)}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Số tiền"
                            key="totalAmount"
                            render={(_, record) => (
                                <p>{formatPrice(record.totalAmount - record.totalCouponDiscount)}</p>
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
                                } else if (record.orderStatusId === ORDER_SELLER_REFUNDED) {
                                    return <Tag color="cyan">Hoàn lại tiền</Tag>
                                } else if (record.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                    return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
                                } else if (record.orderStatusId === ORDER_SELLER_VIOLATES) {
                                    return <Tag color="#f50">Người bán vi phạm</Tag>
                                }
                            }}
                        />
                        <Column
                            width="9%"
                            key="actions"
                            title="Thao tác"
                            render={(_, record) => (
                                <Link to={`/seller/order/${record.orderId}`} >
                                    Chi tiết
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