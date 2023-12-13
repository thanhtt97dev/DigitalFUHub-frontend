/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { EditOutlined, LeftOutlined, PlusOutlined, QuestionCircleOutlined, ShopOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Space, Switch, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ParseDateTime, formatPrice, getUserId } from "~/utils";
import { COUPON_TYPE_SPECIFIC_PRODUCTS, PAGE_SIZE, RESPONSE_CODE_SUCCESS } from "~/constants";
import { getCouponSellerById } from "~/api/coupon";
import Column from "antd/es/table/Column";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { NotificationContext } from "~/context/UI/NotificationContext";
import { getListOrdersByCoupon } from "~/api/order";
import Spinning from "~/components/Spinning";


function CouponDetail() {
    const navigate = useNavigate();
    // const notification = useContext(NotificationContext);
    const { couponId } = useParams();
    const [coupon, setCoupon] = useState();
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCouponSellerById(getUserId(), couponId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setCoupon(res.data.result);
                } else {
                    return navigate("/seller/coupon/list")
                }
            })
            .catch((err) => {
                return navigate("/seller/coupon/list")
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, []);
    useEffect(() => {
        getListOrdersByCoupon(couponId, page)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(res.data.result.orders);
                    setTotalItems(res.data.result.totalItems);
                } else {
                    return navigate("/seller/coupon/list")
                }
            })
            .catch((err) => {
                return navigate("/seller/coupon/list")
            })
    }, [couponId, page]);
    const initialFieldsForm = [
        {
            name: 'couponName',
            value: coupon?.couponName !== undefined ? coupon.couponName : '',
        },
        {
            name: 'couponCode',
            value: coupon?.couponCode !== undefined ? coupon?.couponCode : '',
        },
        {
            name: 'startDate',
            value: dayjs(coupon?.startDate),
        },
        {
            name: 'endDate',
            value: dayjs(coupon?.endDate),
        },
        {
            name: 'priceDiscount',
            value: coupon?.priceDiscount !== undefined ? coupon?.priceDiscount : 0,
        },
        {
            name: 'minTotalOrderValue',
            value: coupon?.minTotalOrderValue !== undefined ? coupon?.minTotalOrderValue : 0,
        },
        {
            name: 'isPublic',
            value: coupon?.isPublic !== undefined ? coupon?.isPublic : true,
        },
        {
            name: 'quantity',
            value: coupon?.quantity !== undefined ? coupon?.quantity : 0,
        }
    ]
    return (<Spinning spinning={loading}>
        <Card
            title={
                <Space>
                    <Link to={"/seller/coupon/list"}><LeftOutlined /> Trở lại</Link>
                    <div>Chi tiết mã giảm giá</div>
                    {dayjs(coupon?.startDate) > dayjs() ? <Link to={`/seller/coupon/edit/${coupon.couponId}`}><Tooltip title="Chỉnh sửa"><EditOutlined /></Tooltip></Link> : ''}
                </Space>
            }
        >
            {
                coupon &&
                <>
                    <Form
                        fields={initialFieldsForm}
                        disabled={true}
                    >
                        <Row>
                            <Col span={5} offset={1}><label>Loại mã giảm giá</label></Col>
                            <Col span={10}>
                                <Form.Item>
                                    <div>
                                        <Space
                                            align="center"
                                            style={{
                                                border: '1px solid #1677ff',
                                                borderRadius: '10px',
                                                padding: '10px',
                                                color: '#1677ff',
                                                cursor: 'default'
                                            }}
                                        >
                                            {coupon.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS
                                                ?
                                                <>
                                                    <ShoppingOutlined style={{ fontSize: '20px' }} />
                                                    <div level={5} style={{ color: 'inherit', textAlign: 'center' }}>Mã giảm giá cho các sản phẩm chỉ định</div>
                                                </>
                                                :
                                                <>
                                                    <ShopOutlined style={{ fontSize: '20px' }} />
                                                    <div level={5} style={{ color: 'inherit', textAlign: 'center' }}>Mã giảm giá cho tất cả sản phẩm</div>
                                                </>
                                            }
                                        </Space>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Tên mã giảm giá <Tooltip title="Tên mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="couponName"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Mã giảm giá <Tooltip title="Mã giảm giá áp dụng cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="couponCode"
                                >
                                    <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Thời gian giảm giá <Tooltip title="Thời gian áp dụng mã giảm giá cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Row gutter={[16, 0]}>
                                    <Col span={11}>
                                        <Form.Item name="startDate"
                                            initialValue={dayjs().add(10, 'minute')}
                                        >
                                            <DatePicker locale={locale}
                                                style={{ width: '100%' }}
                                                allowClear={false}
                                                format={"M/D/YYYY HH:mm"}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    // defaultValue: dayjs(`${dayjs().add(10, 'minute').hour()}:${dayjs().add(10, 'minute').minute()}`, 'HH:mm'),
                                                }}
                                                placement={"bottomLeft"}
                                                placeholder="Thời gian bắt đầu"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <div style={{ width: '100%', height: '50%', position: 'relative' }}>
                                            <div style={{ width: '100%', height: '1px', top: '50%', background: '#bababa', position: 'absolute' }}></div>
                                        </div>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item name="endDate"
                                            initialValue={dayjs().add(70, 'minute')}
                                        >
                                            <DatePicker locale={locale}
                                                style={{ width: '100%' }}
                                                allowClear={false}
                                                format={"M/D/YYYY HH:mm"}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: dayjs(`${dayjs().add(60, 'minute').hour()}:${dayjs().add(60, 'minute').minute()}`, 'HH:mm'),
                                                }}
                                                placement={"bottomLeft"}
                                                placeholder="Thời gian kết thúc"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Giá trị đơn hàng tối thiểu <Tooltip title="Số tiền tối thiểu của đơn hàng để có thể áp dụng được mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="minTotalOrderValue">
                                    <InputNumber addonAfter="đ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Số tiền giảm giá <Tooltip title="Số tiền được giảm khi áp dụng mã cho đơn hàng."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="priceDiscount">
                                    <InputNumber addonAfter="đ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Số lượng <Tooltip title="Số lượng mã giảm giá."><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="quantity">
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Thiết lập hiển thị <Tooltip title={<div><p>Công khai: mọi người được đề xuất mã giảm giá này khi đặt hàng.</p><br /><p>Riêng tư: mọi người sẽ phải nhập mã để tìm thấy mã giảm giá này.</p></div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                            <Col span={10}>
                                <Form.Item name="isPublic" valuePropName="checked" >
                                    <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}><label>Trạng thái </label></Col>
                            <Col span={10}>
                                <Form.Item name="status">
                                    {
                                        (() => {
                                            const now = dayjs();
                                            const startDate = dayjs(coupon.startDate)
                                            const endDate = dayjs(coupon.endDate)
                                            if (startDate.isBefore(now) && now.isBefore(endDate)) {
                                                return <Tag style={{ lineHeight: '1.8', fontSize: '14px' }} color="green">Đang diễn ra</Tag>
                                            } else if (endDate.isBefore(now)) {
                                                return <Tag style={{ lineHeight: '1.8', fontSize: '14px' }} color="red">Đã kết thúc</Tag>
                                            } else {
                                                return <Tag style={{ lineHeight: '1.8', fontSize: '14px' }}>Sắp diễn ra</Tag>
                                            }
                                        })()
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        {coupon.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS &&
                            <Row>
                                <Col span={5} offset={1}><label>Sản phẩm được áp dụng <Tooltip title={<div>Mã giảm giá sẽ được áp dụng cho những sản phẩm được chọn.</div>}><QuestionCircleOutlined /></Tooltip></label></Col>
                                <Col span={15}>
                                    <Form.Item name="applicableProducts">
                                        <Space size={[16, 8]}>
                                            <span>Đã chọn ({coupon.productsApplied.length}) sản phẩm</span>
                                            <Button type="dashed" danger icon={<PlusOutlined />} >Chọn sản phẩm</Button>
                                        </Space>
                                    </Form.Item>

                                    <Table
                                        scroll={{ y: 400 }}
                                        // pagination={false}
                                        pagination={{
                                            pageSize: PAGE_SIZE,
                                            showSizeChanger: false,
                                        }}
                                        rowKey={(record) => record.productId}
                                        dataSource={coupon.productsApplied}
                                    >
                                        <Column
                                            width="20%"
                                            title="ID sản phẩm"
                                            key="productId"
                                            render={(_, record) => (
                                                <div>{record.productId}</div>
                                            )}
                                        />
                                        <Column
                                            width="65%"
                                            title="Tên sản phẩm"
                                            key="productName"
                                            render={(_, record) => (
                                                <Space size={[8, 8]}>
                                                    <Image width={90} src={record.thumbnail} />
                                                    <p>{record.productName}</p>
                                                </Space>
                                            )}
                                        />
                                    </Table>
                                </Col>
                            </Row>
                        }
                        {
                            (() => {
                                const now = dayjs();
                                const startDate = dayjs(coupon.startDate)
                                if (now.isBefore(startDate)) {
                                    return null;
                                } else {
                                    return <Row>
                                        <Col span={5} offset={1}><label>Đơn hàng đã dùng mã </label></Col>
                                        <Col span={10}>
                                            <Form.Item >
                                                <Space direction="vertical">
                                                    <div>Tổng ({totalItems}) đơn hàng đã áp dụng mã giảm giá</div>
                                                    {totalItems > 0 &&
                                                        <Table
                                                            scroll={{ y: 500 }}
                                                            pagination={{
                                                                pageSize: PAGE_SIZE,
                                                                current: page,
                                                                showSizeChanger: false,
                                                                onChange: (page) => setPage(page)
                                                            }}
                                                            dataSource={orders}
                                                            rowKey={record => record.orderId}
                                                        >
                                                            <Column
                                                                width="20%"
                                                                title="Mã đơn hàng"
                                                                key="orderId"
                                                                render={(_, record) => {
                                                                    return <Link to={`/seller/order/${record.orderId}`}><p>{record.orderId}</p></Link>
                                                                }}
                                                            />
                                                            <Column
                                                                width="20%"
                                                                title="Người mua"
                                                                key="username"
                                                                render={(_, record) => {
                                                                    return <p>{record.username}</p>
                                                                }}
                                                            />
                                                            <Column
                                                                width="20%"
                                                                title="Ngày mua"
                                                                key="orderDate"
                                                                render={(_, record) => {
                                                                    return <p>{ParseDateTime(record.orderDate)}</p>
                                                                }}
                                                            />
                                                            <Column
                                                                width="20%"
                                                                title="Tổng tiền đơn hàng"
                                                                key="totalAmount"
                                                                render={(_, record) => {
                                                                    return <p>{formatPrice(record.totalAmount - record.totalCouponDiscount)}</p>
                                                                }}
                                                            />
                                                        </Table>
                                                    }
                                                </Space>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                }
                            })()
                        }

                    </Form>
                </>
            }

        </Card >
    </Spinning>);
}

export default CouponDetail;