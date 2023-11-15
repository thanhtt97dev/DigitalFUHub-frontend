import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag, Button, Form, Input, DatePicker, Select, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { useAuthUser } from 'react-auth-kit'

import { NotificationContext } from '~/context/UI/NotificationContext';

import { getWithdrawTransaction } from '~/api/bank'
import Spinning from "~/components/Spinning";
import ModalRequestWithdraw from "~/components/Modals/ModalRequestWithdraw";
import { formatPrice, ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    WITHDRAW_TRANSACTION_IN_PROCESSING,
    WITHDRAW_TRANSACTION_PAID,
    WITHDRAW_TRANSACTION_REJECT,
} from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'withdrawTransactionId',
        width: '5%',
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        width: '15%',
        render: (amount) => {
            return (
                <p>{formatPrice(amount)}</p>
            )
        }
    },
    {
        title: 'Thời gian tạo yêu cầu',
        dataIndex: 'requestDate',
        width: '16%',
        render: (requestDate) => {
            return (
                <p>{ParseDateTime(requestDate)}</p>
            )
        }
    },
    {
        title: 'Đơn vị thụ hưởng',
        dataIndex: 'creditAccountName',
        width: '20%',
    },
    {
        title: 'Số tài khoản',
        dataIndex: 'creditAccount',
        width: '15%',
    },
    {
        title: 'Ngân hàng đối tác',
        dataIndex: 'bankName',
        width: '15%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'withdrawTransactionStatusId',
        width: '7%',
        render: (withdrawTransactionStatusId, record) => {
            if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING) {
                return <Tag color="#ecc30b">Đang xử lý yêu cầu</Tag>
            } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID) {
                return <Tag color="#52c41a">Thành công</Tag>
            } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                return <Tag color="red">Từ chối</Tag>
            }
        }
    },
    {
        title: '',
        dataIndex: 'withdrawTransactionStatusId',
        width: '5%',
        render: (withdrawTransactionStatusId, record) => {
            if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID ||
                withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                return <DrawerWithdrawTransactionBill userId={record.userId} withdrawTransactionId={record.withdrawTransactionId} />
            } else {
                return ""
            }

        }
    },

];

function HistoryWithdraw() {
    const notification = useContext(NotificationContext);
    const auth = useAuthUser()
    const user = auth();
    const [loading, setLoading] = useState(true)

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getWithdrawTransaction(user.id, searchData)
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
            name: 'withdrawTransactionId',
            value: searchData.withdrawTransactionId,
        },
        {
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        },
        {
            name: 'status',
            value: searchData.status
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
            withdrawTransactionId: values.withdrawTransactionId,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            status: values.status
        });
    };

    const handleSearchDataTable = () => {
        setLoading(true);
        getWithdrawTransaction(user.id, searchData)
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
    }



    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        marginBottom: 15,
                        minHeight: "600px"
                    }}
                    hoverable
                >
                    <Form
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={6} offset={2}>Mã giao dịch:</Col>
                                    <Col span={12}>
                                        <Form.Item name="withdrawTransactionId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={6} offset={2}>Thời gian tạo yêu cầu:</Col>
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
                                <Row>
                                    <Col span={6} offset={2}>Trạng thái</Col>
                                    <Col span={12}>
                                        <Form.Item name="status" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Đang xử lý yêu cầu</Select.Option>
                                                <Select.Option value={2}>Thành công</Select.Option>
                                                <Select.Option value={3}>Từ chối</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={2} offset={16}>
                                        <Button type="primary" htmlType="submit">
                                            Tìm kiếm
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Form>
                    <ModalRequestWithdraw userId={user.id} callBack={() => handleSearchDataTable()} style={{ marginBottom: "5px" }} />

                    <Table columns={columns} pagination={{ pageSize: 5 }} dataSource={dataTable} rowKey={(record) => record.withdrawTransactionId} />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryWithdraw;