import { useContext, useEffect, useState } from "react";
import { Card, Table, Modal, Button, Form, Input, Space, DatePicker, Select, Row, Col, Switch, InputNumber, Tooltip, Typography } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';

import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, getUserId, ParseDateTime } from '~/utils/index'
import { NotificationContext } from "~/context/NotificationContext";
import dayjs from 'dayjs';
import {
    COUPON_TYPE_ALL_PRODUCTS_OF_SHOP,
    COUPON_TYPE_SPECIFIC_PRODUCTS,
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import Column from "antd/es/table/Column";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { addCouponSeller, removeCouponSeller, getCouponsSeller, updateStatusCouponSeller, getCouponSellerById, editCouponSeller } from "~/api/coupon";
import { checkCouponCodeExist } from "~/api/coupon";
import { regexPattern } from "../../../../utils";
import styles from "./Coupon.module.scss"
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
const { Title } = Typography;

const cx = classNames.bind(styles)

const { RangePicker } = DatePicker;

const { confirm } = Modal;

const removeSecondOfDateTime = (date) => date.slice(0, date.length - 6) + ' ' + date.slice(-2)

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
            status: values.status
        });

    }
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
                updateStatusCouponSeller(data)
                    .then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setSearchData({
                                ...searchData,
                                userId: getUserId(),
                            });
                            notification("success", "Cập nhật mã giảm giá thành công.")
                        } else {
                            notification("error", "Cập nhật mã giảm giá thất bại.")
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
    // const handleRemoveCoupon = (couponId) => {
    //     confirm({
    //         title: `Bạn có muốn xóa mã giảm giá này không?`,
    //         okText: 'Đồng ý',
    //         cancelText: 'Hủy',
    //         onOk() {
    //             const data = {
    //                 userId: getUserId(),
    //                 couponId: couponId,
    //             }
    //             removeCouponSeller(data)
    //                 .then((res) => {
    //                     if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
    //                         setSearchData({
    //                             ...searchData,
    //                             userId: getUserId(),
    //                         });
    //                         notification("success", "Xóa mã giảm giá thành công.")
    //                     } else {
    //                         notification("error", "Xóa mã giảm giá thất bại.")
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
    const [isOpenOptionAddCouponModal, setIsOpenOptionAddCouponModal] = useState(false);
    return (
        <>
            <Modal title="Basic Modal" open={isOpenOptionAddCouponModal}
                onOk={() => { setIsOpenOptionAddCouponModal(false) }}
                onCancel={() => { setIsOpenOptionAddCouponModal(false) }}
            >
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Link to={`/seller/coupon/add?case=${COUPON_TYPE_ALL_PRODUCTS_OF_SHOP}`}>
                            <Button type="primary">Thêm mã giảm cho shop</Button>
                        </Link>
                    </Col>
                    <Col span={12}>
                        <Link to={`/seller/coupon/add?case=${COUPON_TYPE_SPECIFIC_PRODUCTS}`}>
                            <Button type="primary">Thêm mã giảm cho sản phẩm chỉ định</Button>
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
                                <Button type="primary" onClick={() => setIsOpenOptionAddCouponModal(true)}>Thêm mã giảm giá</Button>
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
                            sorter={
                                {
                                    compare: (a, b) => {
                                        if (a.couponCode < b.couponCode) {
                                            return -1;
                                        } else if (a.couponCode > b.couponCode) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            }
                            render={(_, record) => (
                                <p>{record.couponCode}</p>
                            )}
                        />

                        <Column
                            width="15%"
                            title="Số tiền giảm giá"
                            key="priceDiscount"
                            sorter={(a, b) => a.priceDiscount - b.priceDiscount}
                            render={(_, record) => (
                                <p>{formatStringToCurrencyVND(record.priceDiscount)} đ</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian bắt đầu"
                            key="startDate"
                            sorter={
                                {
                                    compare: (a, b) => {
                                        if (a.startDate < b.startDate) {
                                            return -1;
                                        } else if (a.startDate > b.startDate) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            }
                            render={(_, record) => (
                                <p>{ParseDateTime(record.startDate)}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Thời gian kết thúc"
                            key="endDate"
                            sorter={
                                {
                                    compare: (a, b) => {
                                        if (a.startDate < b.startDate) {
                                            return -1;
                                        } else if (a.startDate > b.startDate) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            }
                            render={(_, record) => (
                                <p>{ParseDateTime(record.endDate)}</p>
                            )}
                        />
                        <Column
                            width="10%"
                            title="Số lượng"
                            key="quantity"
                            sorter={(a, b) => a.quantity - b.quantity}
                            render={(_, record) => (
                                <p>{record.quantity}</p>
                            )}
                        />
                        <Column
                            width="15%"
                            title="Đơn hàng tối thiểu"
                            key="minTotalOrderValue"
                            sorter={(a, b) => a.minTotalOrderValue - b.minTotalOrderValue}
                            render={(_, record) => (
                                <p>{formatStringToCurrencyVND(record.minTotalOrderValue)} đ</p>
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
                                <Row gutter={[8, 8]}>
                                    <Col>
                                        <Button type="primary" style={{ width: '80px' }}>Chi tiết</Button>
                                    </Col>
                                    <Col>
                                        <Button type="dashed" style={{ width: '80px' }} danger >Xóa</Button>
                                    </Col>
                                </Row>
                            )}
                        />

                    </Table>
                </Card>
            </Spinning>
        </>
    )
}

export default Coupons;