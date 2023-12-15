/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { Card, Table, Modal, Button, Form, Input, Space, DatePicker, Select, Row, Col, Typography, Tag } from "antd";
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
    PAGE_SIZE,
    RESPONSE_CODE_SHOP_BANNED,
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import Column from "antd/es/table/Column";
import { PlusOutlined, SearchOutlined, ShopOutlined, ShoppingOutlined } from "@ant-design/icons";
import { removeCouponSeller, getCouponsSeller, updateCouponFinish } from "~/api/coupon";
import styles from "./Coupon.module.scss"
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { getShopOfSeller } from "~/api/shop";
import { CheckUserBanContext } from "~/components/CheckAccess/CheckUserBan";
const { Title } = Typography;

const cx = classNames.bind(styles)

const { RangePicker } = DatePicker;

// const removeSecondOfDateTime = (date) => date.slice(0, date.length - 6) + ' ' + date.slice(-2)


const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Sắp diễn ra",
        key: "tab2",
    },
    {
        label: "Đang diễn ra",
        key: "tab3",
    },
    {
        label: "Đã kết thúc",
        key: "tab4",
    },
]

function Coupons() {
    const notification = useContext(NotificationContext)
    const isShopBan = useContext(CheckUserBanContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formSearch] = Form.useForm();
    const [listCoupons, setListCoupons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchData, setSearchData] = useState({
        couponCode: '',
        userId: getUserId(),
        startDate: null,
        endDate: null,
        isPublic: 0,
        status: COUPON_STATUS_ALL,
        page: page
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
        // {
        //     name: 'status',
        //     value: searchData.status,
        // },
    ];
    useEffect(() => {
        const data = {
            ...searchData,
            isPublic: searchData.isPublic === 0 ? null : searchData.isPublic === 1 ? true : false
        }
        setLoading(true);
        getCouponsSeller(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setListCoupons(res.data.result.coupons);
                    setTotalItems(res.data.result.totalItems)
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                    return navigate('/shopBanned')
                }
                else {
                    notification('error', 'Đã có lỗi xảy ra.')
                }
            })
            .catch((err) => {
                notification('error', 'Đã có lỗi xảy ra.')
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const onFinishSearch = (values) => {
        setPage(1);
        setSearchData({
            couponCode: !values.couponCode ? '' : values.couponCode.trim(),
            userId: getUserId(),
            startDate: values.date && values.date[0] ? values.date[0].$d.toLocaleDateString() : null,
            endDate: values.date && values.date[1] ? values.date[1].$d.toLocaleDateString() : null,
            isPublic: values.isPublic,
            status: searchData.status,
            page: 1
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
        setButtonLoading(true)
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
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                    return navigate('/shopBanned')
                }
                else {
                    notification("error", "Xóa mã giảm giá thất bại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                couponIdRef.current = 0;
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    handleCloseDeleteCouponModal();
                    clearTimeout(idTimeout);
                }, 500)
            })

    }
    const handleUpdateCouponFinish = (couponId) => {
        setButtonLoading(true);
        updateCouponFinish(couponId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setSearchData({
                        ...searchData,
                        userId: getUserId(),
                    });
                    notification("success", "Kết thúc chương trình giảm giá thành công.")
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                    return navigate('/shopBanned')
                }
                else {
                    notification("error", "Kết thúc chương trình giảm giá thất bại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                couponIdRef.current = 0;
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    handleCloseFinishCouponModal();
                    clearTimeout(idTimeout);
                }, 500)
            })

    }
    const [isOpenOptionAddCouponModal, setIsOpenOptionAddCouponModal] = useState(false);

    const handleTableChange = (pagination, filters, sorter) => {
        if (pagination.current !== page && pagination.current <= pagination.total) {
            setPage(pagination.current)
            setSearchData({
                ...searchData,
                page: pagination.current
            })
        }
    };
    const couponIdRef = useRef(0);
    const table = (data, isShopBan = false) => {
        return <>
            <Table
                onChange={handleTableChange}
                pagination={{
                    current: page,
                    total: totalItems,
                    pageSize: PAGE_SIZE,
                    showSizeChanger: false,
                }}
                rowKey={(record) => record.couponId}
                dataSource={data}
                size='medium'
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
                    render={(_, record) => (
                        <p>{record.couponName}</p>
                    )}
                />
                <Column
                    fixed='left'
                    width="20%"
                    title="Mã giảm giá"
                    key="couponCode"
                    render={(_, record) => (
                        <p>{record.couponCode}</p>
                    )}
                />
                <Column
                    width="25%"
                    title="Thời gian bắt đầu"
                    key="startDate"
                    render={(_, record) => (
                        <p>{ParseDateTime(record.startDate)}</p>
                    )}
                />
                <Column
                    width="25%"
                    title="Thời gian kết thúc"
                    key="endDate"
                    render={(_, record) => (
                        <p>{ParseDateTime(record.endDate)}</p>
                    )}
                />
                <Column
                    width="25%"
                    title="Sản phẩm áp dụng"
                    key="productApplied"
                    render={(_, record) => (
                        <p>{record.couponTypeId === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP ? 'Tất cả sản phẩm' : `Tổng cộng ${record.productsApplied.length} sản phẩm`}</p>
                    )}
                />
                <Column
                    width="25%"
                    title="Đơn hàng tối thiểu"
                    key="minTotalOrderValue"
                    render={(_, record) => (
                        <p>{formatPrice(record.minTotalOrderValue)}</p>
                    )}
                />
                <Column
                    width="25%"
                    title="Số tiền giảm giá"
                    key="priceDiscount"
                    render={(_, record) => (
                        <p>{formatPrice(record.priceDiscount)}</p>
                    )}
                />
                <Column
                    width="15%"
                    title="Số lượng"
                    key="quantity"
                    render={(_, record) => (
                        <p>{record.quantity}</p>
                    )}
                />

                <Column
                    width="15%"
                    title="Hiển thị"
                    key="isPublic"
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
                        const endDate = dayjs(record.endDate)
                        if (now.isBefore(startDate)) {
                            return <Row gutter={[8, 0]}>
                                <Col>
                                    <Link to={`/seller/coupon/detail/${record.couponId}`}>
                                        <Button type="link" style={{ width: '80px' }}>Chi tiết</Button>
                                    </Link>
                                </Col>
                                {!isShopBan &&
                                    <Col>
                                        <Link to={`/seller/coupon/edit/${record.couponId}`} >
                                            <Button type="link" style={{ width: '80px' }}>Chỉnh sửa</Button>
                                        </Link>
                                    </Col>
                                }
                                {!isShopBan &&
                                    <Col>
                                        <Button type="link" style={{ width: '80px' }} onClick={() => { handleOpenDeleteCouponModal(); couponIdRef.current = record.couponId }}>Xóa</Button>
                                    </Col>
                                }
                            </Row>
                        } else if (startDate.isBefore(now) && now.isBefore(endDate)) {
                            return <Row gutter={[8, 0]}>
                                <Col>
                                    <Link to={`/seller/coupon/detail/${record.couponId}`}>
                                        <Button type="link" style={{ width: '80px' }}>Chi tiết</Button>
                                    </Link>
                                </Col>
                                <Col>
                                    <Button type="link" style={{ width: '80px' }} onClick={() => { handleOpenFinishCouponModal(); couponIdRef.current = record.couponId }}>Kết thúc</Button>
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
        </>
    }

    const [activeTabKey, setActiveTabKey] = useState('tab1');

    const contentList = {
        tab1: table(listCoupons, isShopBan),
        tab2: table(listCoupons, isShopBan),
        tab3: table(listCoupons, isShopBan),
        tab4: table(listCoupons, isShopBan),
    };

    const onTabChange = (key) => {
        switch (key) {
            case 'tab1':
                setSearchData({
                    ...searchData,
                    page: 1,
                    status: COUPON_STATUS_ALL
                })
                break;
            case 'tab2':
                setSearchData({
                    ...searchData,
                    page: 1,
                    status: COUPON_STATUS_COMING_SOON
                })
                break;
            case 'tab3':
                setSearchData({
                    ...searchData,
                    page: 1,
                    status: COUPON_STATUS_ONGOING
                })
                break;
            case 'tab4':
                setSearchData({
                    ...searchData,
                    page: 1,
                    status: COUPON_STATUS_FINISHED
                })
                break;
            default: return;
        }
        setActiveTabKey(key);
    }
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showDeleteCouponModal, setShowDeleteCouponModal] = useState(false);

    const handleOpenDeleteCouponModal = () => {
        setShowDeleteCouponModal(true);
    }
    const handleCloseDeleteCouponModal = () => {
        setShowDeleteCouponModal(false);
    }
    const [showFinishCouponModal, setShowFinishCouponModal] = useState(false);

    const handleOpenFinishCouponModal = () => {
        setShowFinishCouponModal(true);
    }
    const handleCloseFinishCouponModal = () => {
        setShowFinishCouponModal(false);
    }
    return (
        <>
            <Modal title="Xác nhận" open={showDeleteCouponModal} footer={null}
                onOk={handleCloseDeleteCouponModal}
                onCancel={handleCloseDeleteCouponModal}
            >
                <div>Bạn có muốn xóa mã giảm giá này không?</div>
                <Row justify="end" gutter={[16, 16]}>
                    <Col>
                        <Button onClick={handleCloseDeleteCouponModal} danger>Hủy</Button>
                    </Col>
                    <Col>
                        <Button loading={buttonLoading} type="primary" onClick={() => handleRemoveCoupon(couponIdRef.current)}>Đồng ý</Button>
                    </Col>
                </Row>
            </Modal>
            <Modal title="Xác nhận" open={showFinishCouponModal} footer={null}
                onOk={handleCloseFinishCouponModal}
                onCancel={handleCloseFinishCouponModal}
            >
                <div>Bạn có kết thúc chương trình giảm giá này không?</div>
                <Row justify="end" gutter={[16, 16]}>
                    <Col>
                        <Button onClick={handleCloseFinishCouponModal} danger>Hủy</Button>
                    </Col>
                    <Col>
                        <Button loading={buttonLoading} type="primary" onClick={() => handleUpdateCouponFinish(couponIdRef.current)}>Đồng ý</Button>
                    </Col>
                </Row>
            </Modal>
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
                <Card>
                    <Form
                        form={formSearch}
                        onFinish={onFinishSearch}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={3} offset={1}><label>Mã giảm giá</label></Col>
                            <Col span={6}>
                                <Form.Item name="couponCode" >
                                    <Input placeholder="Mã giảm giá" />
                                </Form.Item>
                            </Col>

                            <>
                                {/* {activeTabKey === 'tab1' ?
                                    <>
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
                                    </>
                                    :
                                    <></>
                                } */}
                            </>
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
                            <Col span={2} offset={2}><label>Hiển thị</label></Col>
                            <Col span={6}>
                                <Form.Item name="isPublic" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Công khai</Select.Option>
                                        <Select.Option value={2}>Riêng tư</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={1}>
                                {!isShopBan &&
                                    <Button type="primary" icon={<PlusOutlined />} ghost onClick={() => setIsOpenOptionAddCouponModal(true)}>Tạo mã giảm giá</Button>
                                }
                            </Col>
                            <Col flex={5} style={{ marginRight: '4em' }}>
                                <Row gutter={[16, 16]} justify="end">
                                    <Col>
                                        <Button onClick={() => {
                                            setSearchData(prev => {
                                                const newSearchData =
                                                {
                                                    couponCode: '',
                                                    userId: getUserId(),
                                                    startDate: null,
                                                    endDate: null,
                                                    isPublic: 0,
                                                    status: prev.status,
                                                    page: page
                                                }
                                                return newSearchData;
                                            })
                                        }}>
                                            Xóa
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                            Tìm kiếm
                                        </Button>
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                    </Form>

                </Card>
                <Card
                    style={{ marginTop: "10px", minHeight: '100vh' }}
                    tabList={tabList}
                    activeTabKey={activeTabKey}
                    onTabChange={onTabChange}
                >
                    {contentList[activeTabKey]}
                </Card>
            </Spinning >
        </>
    )
}

export default Coupons;