import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Tag, Button, Form, Input, DatePicker, Select, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';

import { useAuthUser } from 'react-auth-kit'
import { NotificationContext } from '~/context/UI/NotificationContext';

import { getDepositTransaction } from '~/api/bank'
import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime } from '~/utils/index'
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import ModalRequestDeposit from "~/components/Modals/ModalRequestDeposit";


const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'depositTransactionId',
        width: '10%',
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
        width: '15%',
        render: (requestDate) => {
            return (
                <p>{ParseDateTime(requestDate)}</p>
            )
        }
    },
    {
        title: 'Thời gian chuyển khoản',
        dataIndex: 'paidDate',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <p>{ParseDateTime(paidDate)}</p>
                    :
                    <p>TBD</p>
            )
        }
    },
    {
        title: 'Nội dung chuyển khoản',
        dataIndex: 'code',
        width: '15%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isPay',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <Tag color="#52c41a">Thành công</Tag>
                    :
                    <Tag color="#ec0b0b">Đang chờ chuyển khoản</Tag>
            )
        }
    },
    {
        title: '',
        dataIndex: 'isPay',
        width: '10%',
        render: (isPay, record) => {
            return (
                isPay ?
                    ""
                    :
                    <Link to={"/deposit"} state={{ amount: record.amount, code: record.code }}>Quét mã QR</Link>
            )
        }
    },
];

function HistoryDeposit() {
    const notification = useContext(NotificationContext);
    const auth = useAuthUser()
    const user = auth();
    const [loading, setLoading] = useState(true)

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        depositTransactionId: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getDepositTransaction(user.id, searchData)
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
            name: 'depositTransactionId',
            value: searchData.depositTransactionId,
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
            depositTransactionId: values.depositTransactionId,
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
                                        <Form.Item name="depositTransactionId" >
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
                                    <Col span={6} offset={2}>Trạng thái:</Col>
                                    <Col span={12}>
                                        <Form.Item name="status" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Thành công</Select.Option>
                                                <Select.Option value={2}>Đang chờ chuyển khoản</Select.Option>
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
                    <ModalRequestDeposit userId={user.id} style={{ marginBottom: "5px" }} text={"+ Nạp tiền"} />
                    <Table columns={columns} pagination={{ pageSize: 5 }} dataSource={dataTable} rowKey={(record) => record.depositTransactionId} />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryDeposit;