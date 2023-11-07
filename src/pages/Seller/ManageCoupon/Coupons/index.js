import { useContext, useEffect, useState } from "react";
import { Card, Table, Modal, Button, Form, Input, Space, DatePicker, Select, Row, Col, Switch, InputNumber, Tooltip, Typography, Tag } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';

import Spinning from "~/components/Spinning";
import { formatPrice, getUserId, ParseDateTime } from '~/utils/index'
import { NotificationContext } from "~/context/UI/NotificationContext";
import dayjs from 'dayjs';
import {
    COUPON_STATUS_ALL,
    COUPON_STATUS_COMING_SOON,
    COUPON_STATUS_FINISHED,
    COUPON_STATUS_ONGOING,
    COUPON_TYPE_ALL_PRODUCTS_OF_SHOP,
    COUPON_TYPE_SPECIFIC_PRODUCTS,
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import Column from "antd/es/table/Column";
import { PlusOutlined, ShopOutlined, ShoppingOutlined } from "@ant-design/icons";
import { removeCouponSeller, getCouponsSeller, updateStatusCouponSeller } from "~/api/coupon";
import styles from "./Coupon.module.scss"
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
const { Title } = Typography;

const cx = classNames.bind(styles)

const { RangePicker } = DatePicker;

const { confirm } = Modal;

// const removeSecondOfDateTime = (date) => date.slice(0, date.length - 6) + ' ' + date.slice(-2)

function Coupons() {
    const notification = useContext(NotificationContext)
    const [loading, setLoading] = useState(true);
    const [formSearch] = Form.useForm();
    const [listCoupons, setListCoupons] = useState([]);

    const [searchData, setSearchData] = useState({
        couponCode: '',
        userId: getUserId(),
        startDate: null,
        endDate: null,
        isPublic: 0,
        status: COUPON_STATUS_COMING_SOON
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
            name: 'isPublic',
            value: searchData.isPublic,
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    useEffect(() => {
        const data = {
            ...searchData,
            isPublic: searchData.isPublic === 0 ? null : searchData.isPublic === 1 ? true : false
        }
        setLoading(true);
        getCouponsSeller(data)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setListCoupons(res.data.result);
                } else {
                    notification('error', 'Đã có lỗi xảy ra.')
                }
            })
            .catch((err) => {
                setLoading(false);
                notification('error', 'Đã có lỗi xảy ra.')
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const onFinishSearch = (values) => {
        setSearchData({
            couponCode: values.couponCode,
            userId: getUserId(),
            startDate: values.date && values.date[0] ? values.date[0].$d.toLocaleDateString() : null,
            endDate: values.date && values.date[1] ? values.date[1].$d.toLocaleDateString() : null,
            isPublic: values.isPublic,
            status: values.status
        });

    }
    // const handleChangeStatus = (couponId, checked) => {
    //     confirm({
    //         title: `Bạn có muốn thay đổi trạng thái sang ${checked ? "công khai" : "riêng tư"} không?`,
    //         okText: 'Đồng ý',
    //         cancelText: 'Hủy',
    //         onOk() {
    //             const data = {
    //                 userId: getUserId(),
    //                 couponId: couponId,
    //                 isPublic: checked
    //             }
    //             updateStatusCouponSeller(data)
    //                 .then((res) => {
    //                     if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
    //                         setSearchData({
    //                             ...searchData,
    //                             userId: getUserId(),
    //                         });
    //                         notification("success", "Cập nhật mã giảm giá thành công.")
    //                     } else {
    //                         notification("error", "Cập nhật mã giảm giá thất bại.")
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     notification("error", "Đã có lỗi xảy ra.")
    //                 })

    //         },
    //         onCancel() {
    //         }
    //     })
    // }
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
                removeCouponSeller(data)
                    .then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setSearchData({
                                ...searchData,
                                userId: getUserId(),
                            });
                            notification("success", "Xóa mã giảm giá thành công.")
                        } else {
                            notification("error", "Xóa mã giảm giá thất bại.")
                        }
                    })
                    .catch((err) => {
                        notification("error", "Đã có lỗi xảy ra.")
                    })
            },
            onCancel() {
            }
        })
    }
    const [isOpenOptionAddCouponModal, setIsOpenOptionAddCouponModal] = useState(false);
    return (
        <>
            <Modal title="Chọn loại mã giảm giá" open={isOpenOptionAddCouponModal}
                onOk={() => { setIsOpenOptionAddCouponModal(false) }}
                onCancel={() => { setIsOpenOptionAddCouponModal(false) }}
                footer={null}
            >
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Link to={`/seller/coupon/add?case=${COUPON_TYPE_ALL_PRODUCTS_OF_SHOP}`}>
                            <Space
                                align="center"
                                direction="vertical"
                                className={cx('option')}
                            >
                                <ShopOutlined style={{ fontSize: '40px' }} />
                                <Title level={5} style={{ color: 'inherit', textAlign: 'center' }}>Mã giảm giá cho tất cả sản phẩm</Title>
                            </Space>
                        </Link>
                    </Col>
                    <Col span={12}>
                        <Link to={`/seller/coupon/add?case=${COUPON_TYPE_SPECIFIC_PRODUCTS}`}>
                            <Space
                                align="center"
                                direction="vertical"
                                className={cx('option')}
                            >
                                <ShoppingOutlined style={{ fontSize: '40px' }} />
                                <Title level={5} style={{ color: 'inherit', textAlign: 'center' }}>Mã giảm giá cho các sản phẩm chỉ định</Title>
                            </Space>
                        </Link>
                    </Col>
                </Row>
            </Modal>
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
                            <Col span={3} offset={1}><label>Mã giảm giá</label></Col>
                            <Col span={6}>
                                <Form.Item name="couponCode" >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Trạng thái</label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={COUPON_STATUS_ALL}>Tất cả</Select.Option>
                                        <Select.Option value={COUPON_STATUS_COMING_SOON}>Sắp diễn ra</Select.Option>
                                        <Select.Option value={COUPON_STATUS_ONGOING}>Đang diễn ra</Select.Option>
                                        <Select.Option value={COUPON_STATUS_FINISHED}>Đã kết thúc</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian giảm giá</label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        style={{ width: '100%' }}
                                        allowEmpty={[true, true]}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Hiển thị</label></Col>
                            <Col span={6}>
                                <Form.Item name="isPublic" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Công khai</Select.Option>
                                        <Select.Option value={2}>Riêng tư</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>
                                <Space>
                                    <Button type="primary" htmlType="submit" >
                                        Tìm kiếm
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={1}>
                                <Button type="primary" icon={<PlusOutlined />} ghost onClick={() => setIsOpenOptionAddCouponModal(true)}>Tạo mã giảm giá</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        style={{
                            marginTop: '10px'
                        }}
                        rowKey={(record) => record.couponId}
                        dataSource={listCoupons}
                        size='small'
                        scroll={
                            {
                                y: 290,
                                x: 1300
                            }
                        }
                    >
                        <Column
                            fixed='left'
                            width="25%"
                            title="Tên Mã giảm giá"
                            key="couponName"
                            // sorter={
                            //     {
                            //         compare: (a, b) => {
                            //             if (a.couponCode < b.couponCode) {
                            //                 return -1;
                            //             } else if (a.couponCode > b.couponCode) {
                            //                 return 1;
                            //             } else {
                            //                 return 0;
                            //             }
                            //         }
                            //     }
                            // }
                            render={(_, record) => (
                                <p>{record.couponName}</p>
                            )}
                        />
                        <Column
                            fixed='left'
                            width="20%"
                            title="Mã giảm giá"
                            key="couponCode"
                            // sorter={
                            //     {
                            //         compare: (a, b) => {
                            //             if (a.couponCode < b.couponCode) {
                            //                 return -1;
                            //             } else if (a.couponCode > b.couponCode) {
                            //                 return 1;
                            //             } else {
                            //                 return 0;
                            //             }
                            //         }
                            //     }
                            // }
                            render={(_, record) => (
                                <p>{record.couponCode}</p>
                            )}
                        />


                        <Column
                            width="25%"
                            title="Thời gian bắt đầu"
                            key="startDate"
                            // sorter={
                            //     {
                            //         compare: (a, b) => {
                            //             if (a.startDate < b.startDate) {
                            //                 return -1;
                            //             } else if (a.startDate > b.startDate) {
                            //                 return 1;
                            //             } else {
                            //                 return 0;
                            //             }
                            //         }
                            //     }
                            // }
                            render={(_, record) => (
                                <p>{ParseDateTime(record.startDate)}</p>
                            )}
                        />
                        <Column
                            width="25%"
                            title="Thời gian kết thúc"
                            key="endDate"
                            // sorter={
                            //     {
                            //         compare: (a, b) => {
                            //             if (a.startDate < b.startDate) {
                            //                 return -1;
                            //             } else if (a.startDate > b.startDate) {
                            //                 return 1;
                            //             } else {
                            //                 return 0;
                            //             }
                            //         }
                            //     }
                            // }
                            render={(_, record) => (
                                <p>{ParseDateTime(record.endDate)}</p>
                            )}
                        />
                        <Column
                            width="25%"
                            title="Sản phẩm áp dụng"
                            key="productApplied"
                            // sorter={(a, b) => a.minTotalOrderValue - b.minTotalOrderValue}
                            render={(_, record) => (
                                <p>{record.couponTypeId === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP ? 'Tất cả sản phẩm' : `Tổng cộng ${record.productsApplied.length} sản phẩm`}</p>
                            )}
                        />
                        <Column
                            width="25%"
                            title="Đơn hàng tối thiểu"
                            key="minTotalOrderValue"
                            // sorter={(a, b) => a.minTotalOrderValue - b.minTotalOrderValue}
                            render={(_, record) => (
                                <p>{formatPrice(record.minTotalOrderValue)}</p>
                            )}
                        />
                        <Column
                            width="25%"
                            title="Số tiền giảm giá"
                            key="priceDiscount"
                            // sorter={(a, b) => a.priceDiscount - b.priceDiscount}
                            render={(_, record) => (
                                <p>{formatPrice(record.priceDiscount)}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Số lượng"
                            key="quantity"
                            // sorter={(a, b) => a.quantity - b.quantity}
                            render={(_, record) => (
                                <p>{record.quantity}</p>
                            )}
                        />

                        <Column
                            width="15%"
                            title="Hiển thị"
                            key="isPublic"
                            // sorter={(a, b) => a.minTotalOrderValue - b.minTotalOrderValue}
                            render={(_, record) => (
                                <p>{record.isPublic ? 'Công khai' : 'Riêng tư'}</p>
                            )}
                        />
                        <Column
                            width="20%"
                            fixed='right'
                            title="Trạng thái"
                            key="status"
                            render={(_, record) => {
                                const now = dayjs();
                                const startDate = dayjs(record.startDate)
                                const endDate = dayjs(record.endDate)
                                if (startDate.isBefore(now) && now.isBefore(endDate)) {
                                    return <Tag color="green">Đang diễn ra</Tag>
                                } else if (endDate.isBefore(now)) {
                                    return <Tag color="red">Đã kết thúc</Tag>
                                } else {
                                    return <Tag>Sắp diễn ra </Tag>
                                }
                            }}
                        />
                        <Column
                            width="18%"
                            fixed='right'
                            title="Thao tác"
                            key="actions"
                            render={(_, record) => {
                                const now = dayjs();
                                const startDate = dayjs(record.startDate)
                                if (now.isBefore(startDate)) {
                                    return <Row gutter={[8, 0]}>
                                        <Col>
                                            <Link to={`/seller/coupon/detail/${record.couponId}`}>
                                                <Button type="link" style={{ width: '80px' }}>Chi tiết</Button>
                                            </Link>
                                        </Col>
                                        <Col>
                                            <Link to={`/seller/coupon/edit/${record.couponId}`} >
                                                <Button type="link" style={{ width: '80px' }}>Chỉnh sửa</Button>
                                            </Link>
                                        </Col>
                                        <Col>
                                            <Button type="link" style={{ width: '80px' }} onClick={() => handleRemoveCoupon(record.couponId)}>Xóa</Button>
                                        </Col>
                                    </Row>
                                } else {
                                    return <Row gutter={[8, 0]}>
                                        <Col>
                                            <Link to={`/seller/coupon/detail/${record.couponId}`}>
                                                <Button type="link" style={{ width: '80px' }}>Chi tiết</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                }
                            }}
                        />
                    </Table>
                </Card>
            </Spinning>
        </>
    )
}

export default Coupons;