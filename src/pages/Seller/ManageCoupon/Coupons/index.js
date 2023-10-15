import { useContext, useEffect, useState } from "react";
import { Card, Table, Modal, Button, Form, Input, Space, DatePicker, Select, Row, Col, Switch, InputNumber, Tooltip, Tag } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, getUserId, ParseDateTime } from '~/utils/index'
import { NotificationContext } from "~/context/NotificationContext";
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import Column from "antd/es/table/Column";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { addCoupon, removeCoupon, getCoupons, updateStatusCoupon } from "~/api/seller";
import { checkCouponCodeExist } from "~/api/coupon";

const { RangePicker } = DatePicker;
const { confirm } = Modal;
function Coupons() {
    const notification = useContext(NotificationContext)
    const [loading, setLoading] = useState(false)
    const [formSearch] = Form.useForm();
    const [formModal] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listCoupons, setListCoupons] = useState([]);
    const showModal = () => {
        setIsModalOpen(true);
        formModal.resetFields();
    };
    const handleModalOk = () => {
        setIsModalOpen(false);

    };
    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const [searchData, setSearchData] = useState({
        couponCode: '',
        userId: getUserId(),
        startDate: null,
        endDate: null,
        status: 0
    });

    const initFormValues = [
        {
            name: 'couponCode',
            value: searchData.couponCode,
        },
        {
            name: 'date',
            value: [searchData.startDate !== null ? dayjs(searchData.startDate, 'M/D/YYYY') : null, searchData.endDate !== null ? dayjs(searchData.endDate, 'M/D/YYYY') : null]
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    useEffect(() => {
        const data = {
            ...searchData,
            status: searchData.status === 0 ? null : searchData.status === 1 ? true : false
        }
        getCoupons(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setListCoupons(res.data.result);
                } else {
                    notification('error', 'Lỗi', 'Đã có lỗi xảy ra.')
                }
            })
            .catch((err) => {
                notification('error', 'Lỗi', 'Đã có lỗi xảy ra.')
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const onFinishSearch = (values) => {
        setSearchData({
            couponCode: values.couponCode,
            userId: getUserId(),
            startDate: values.date && values.date[0] ? values.date[0].$d.toLocaleDateString() : null,
            endDate: values.date && values.date[1] ? values.date[1].$d.toLocaleDateString() : null,
            status: values.status
        });

    }
    const onFinishModal = (values) => {
        const data = {
            userId: getUserId(),
            couponCode: values.couponCodeNew,
            priceDiscount: values.priceDiscountNew,
            amountOrderCondition: values.amountOrderConditionNew,
            startDate: values.dateNew[0].$d,
            endDate: values.dateNew[1].$d,
            quantity: values.quantityNew,
            isPublic: values.isPublic
        }
        addCoupon(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Thành công", "Tạo mã giảm giá thành công.")
                    setSearchData({
                        couponCode: '',
                        userId: getUserId(),
                        startDate: null,
                        endDate: null,
                        status: 0
                    });
                } else {
                    notification("error", "Thành công", "Tạo mã giảm giá thất bại.")
                }
            })
            .catch((err) => {
                notification("error", "Thành công", "Tạo mã giảm giá thất bại.")
            })
        handleModalOk();
    }
    const disabledDate = current => {
        return current && current < dayjs().startOf('day');
    };

    const handleChangeStatus = (couponId, checked) => {
        confirm({
            title: `Bạn có muốn thay đổi trạng thái sang ${checked ? "công khai" : "riêng tư"} không?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const data = {
                    userId: getUserId(),
                    couponId: couponId,
                    isPublic: checked
                }
                updateStatusCoupon(data)
                    .then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setSearchData({
                                ...searchData,
                                userId: getUserId(),
                            });
                            notification("success", "Thành công", "Cập nhật mã giảm giá thành công.")
                        } else {
                            notification("error", "Thất bại", "Cập nhật mã giảm giá thất bại.")
                        }
                    })
                    .catch((err) => {
                        notification("error", "Thất bại", "Cập nhật mã giảm giá thất bại.")
                    })

            },
            onCancel() {
            }
        })

    }
    const handleRemoveCoupon = (couponId) => {
        confirm({
            title: `Bạn có muốn xóa mã giảm giá này không?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const data = {
                    userId: getUserId(),
                    couponId: couponId,
                }
                removeCoupon(data)
                    .then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setSearchData({
                                ...searchData,
                                userId: getUserId(),
                            });
                            notification("success", "Thành công", "Xóa mã giảm giá thành công.")
                        } else {
                            notification("error", "Thất bại", "Xóa mã giảm giá thất bại.")
                        }
                    })
                    .catch((err) => {
                        notification("error", "Thất bại", "Xóa mã giảm giá thất bại.")
                    })

            },
            onCancel() {
            }
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
                    title="Danh sách mã giảm giá"
                >
                    <Form
                        form={formSearch}
                        onFinish={onFinishSearch}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={3} offset={1}><label>Mã giảm giá:  </label></Col>
                            <Col span={6}>
                                <Form.Item name="couponCode" >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian giảm giá: </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        style={{ width: '100%' }}
                                        allowEmpty={[true, true]}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Trạng thái: </label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Công khai</Select.Option>
                                        <Select.Option value={2}>Riêng tư</Select.Option>
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
                        <Row>
                            <Col offset={1}>
                                <Button onClick={showModal} type="primary">Thêm mã giảm giá</Button>
                            </Col>
                        </Row>
                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                    <Table
                        style={{
                            marginTop: '10px'
                        }}
                        rowKey={(record) => record.couponId}
                        dataSource={listCoupons} size='small' scroll={{ y: 290 }}
                    >
                        <Column
                            width="15%"
                            title="Mã giảm giá"
                            key="couponCode"
                            render={(_, record) => (
                                <p>{record.couponCode}</p>
                            )}
                        />

                        <Column
                            width="15%"
                            title="Số tiền giảm giá"
                            key="priceDiscount"
                            render={(_, record) => (
                                <p>{formatStringToCurrencyVND(record.priceDiscount)} đ</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian bắt đầu"
                            key="startDate"
                            render={(_, record) => (
                                <p>{ParseDateTime(record.startDate)}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian kết thúc"
                            key="endDate"
                            render={(_, record) => (
                                <p>{ParseDateTime(record.endDate)}</p>
                            )}
                        />
                        <Column
                            width="10%"
                            title="Số lượng"
                            key="quantity"
                            render={(_, record) => (
                                <p>{record.quantity}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Đơn hàng tối thiểu"
                            key="amountOrderCondition"
                            render={(_, record) => (
                                <p>{formatStringToCurrencyVND(record.amountOrderCondition)} đ</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Trạng thái"
                            key="isPublic"
                            render={(_, record) => (
                                <Switch checkedChildren="Công khai" onClick={(checked) => handleChangeStatus(record.couponId, checked)} unCheckedChildren="Riêng tư" checked={record.isPublic} />
                            )}
                        />
                        <Column
                            width="15%"
                            title="Trạng thái"
                            key="isPublic"
                            render={(_, record) => (
                                <Button type="dashed" danger onClick={() => handleRemoveCoupon(record.couponId)}>Xóa</Button>
                            )}
                        />

                    </Table>
                </Card>
                <Modal title="Thêm mã giảm giá" open={isModalOpen}
                    onCancel={handleModalCancel}
                    width={600}
                    footer={null}
                >
                    <Form
                        form={formModal}
                        onFinish={onFinishModal}
                    >
                        <Row>
                            <Col span={8} offset={1}><label>Mã giảm giá: <Tooltip title="Mã giảm giá áp dụng cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="couponCodeNew"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            async validator(_, value) {
                                                const data = value === undefined ? '' : value.trim();
                                                if (!data) {
                                                    return Promise.reject(new Error('Mã giảm giá không được trống.'));
                                                } else if (data.length < 4) {
                                                    return Promise.reject(new Error('Mã giảm giá phải có ít nhất 4 kí tự.'));
                                                } else {
                                                    await checkCouponCodeExist(data)
                                                        .then((res) => {
                                                            if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                                                                return Promise.resolve();
                                                            } else {
                                                                return Promise.reject(new Error('Mã giảm giá không hợp lệ.'));
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            return Promise.reject(new Error('Mã giảm giá không hợp lệ.'));
                                                        })

                                                }
                                            },
                                        }),
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8} offset={1}><label>Thời gian giảm giá: <Tooltip title="Thời gian áp dụng mã giảm giá cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="dateNew"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || !value[0] || !value[1]) {
                                                    return Promise.reject(new Error('Thời gian áp dụng mã giảm giá không được trống.'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <RangePicker locale={locale}
                                        style={{ width: '100%' }}
                                        format={"M/D/YYYY HH:mm"}
                                        disabledDate={disabledDate}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [dayjs('00:00', 'HH:mm')],
                                        }}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} offset={1}><label>Đơn hàng tối thiểu: <Tooltip title="Số tiền tối thiểu của đơn hàng để có thể áp dụng được mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="amountOrderConditionNew"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value === undefined || value === null) {
                                                    return Promise.reject(new Error('Số tiền đơn hàng tối thiểu không được để trống.'));
                                                } else if (value < 0) {
                                                    return Promise.reject(new Error('Số tiền đơn hàng tối thiểu phải lớn hơn hoặc bằng 0.'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <InputNumber addonAfter="VNĐ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} offset={1}><label>Số tiền giảm giá: <Tooltip title="Số tiền được giảm khi áp dụng mã cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="priceDiscountNew"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (getFieldValue('amountOrderConditionNew') === undefined || getFieldValue('amountOrderConditionNew') === null) {
                                                    return Promise.reject(new Error('Vui lòng nhập số tiền cho đơn hàng tối thiểu.'));
                                                } else if (value === undefined || value === null) {
                                                    return Promise.reject(new Error('Số tiền giảm giá không được để trống.'));
                                                } else if (value < 0) {
                                                    return Promise.reject(new Error('Số tiền giảm giá phải lớn hơn hoặc bằng 0.'));
                                                } else if (value > getFieldValue('amountOrderConditionNew')) {
                                                    return Promise.reject(new Error('Số tiền giảm giá phải nhỏ hơn hoặc bằng giá tiền đơn hàng tối thiểu.'));
                                                }
                                                else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <InputNumber addonAfter="VNĐ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} offset={1}><label>Số lượng: <Tooltip title="Số lượng mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="quantityNew"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value === undefined || value === null) {
                                                    return Promise.reject(new Error('Số lượng mã giảm giá không được để trống.'));
                                                } else if (value <= 0) {
                                                    return Promise.reject(new Error('Số lượng mã giảm giá phải lớn hơn 0.'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <InputNumber addonAfter="VNĐ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} offset={1}><label>Trạng thái: <Tooltip title={<div><p>Công khai: mọi người có thể tìm thấy mã giảm giá này khi đặt hàng.</p><p>Riêng tư: mọi người sẽ không thể tìm thấy mã giảm giá này, trừ khi được người bán gửi riêng cho người mua.</p></div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={15}>
                                <Form.Item name="isPublic" valuePropName="checked">
                                    <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Col offset={1}>
                                <Button onClick={handleModalCancel} type="default" danger>Hủy</Button>
                            </Col>
                            <Col offset={1}>
                                <Button htmlType="submit" type="primary">Xác nhận</Button>
                            </Col>
                        </Row>

                    </Form>
                </Modal>

            </Spinning>
        </>
    )
}

export default Coupons;