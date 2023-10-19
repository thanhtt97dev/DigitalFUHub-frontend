import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { customerUpdateStatusOrder, getOrderDetailCustomer } from "~/api/order";
import { ParseDateTime, getUserId, formatStringToCurrencyVND } from "~/utils";
import {
    ShopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
    LeftOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Rate, Row, Space, Typography, Tag, Tooltip, Form, Upload, Modal } from "antd";
import { RESPONSE_CODE_SUCCESS, ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import { ChatIcon } from "~/components/Icon";
import { addFeedbackOrder } from "~/api/feedback";
import TextArea from "antd/es/input/TextArea";

const { Text, Title } = Typography;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function OrderDetail() {
    const notification = useContext(NotificationContext);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})

    const getOrderDetail = useCallback(() => {
        getOrderDetailCustomer(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result);
                } else {
                    return navigate("/history/order");
                }
            })
            .catch((err) => {
                return navigate("/history/order");
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getOrderDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleOrderComplaint = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: 3
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        prev.statusId = dataBody.statusId
                        return { ...prev }
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => {
                notification("error", "Thất bại", "Đã có lỗi xảy ra.")
            })
    }

    const handleOrderComplete = () => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: order.shopId,
            orderId: order.orderId,
            statusId: 2
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(prev => {
                        prev.statusId = dataBody.statusId
                        return { ...prev }
                    })
                } else {
                    notification("error", "Thất bại", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => { notification("error", "Thất bại", "Đã có lỗi xảy ra.") })
    }
    const getTextStatusOrder = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Text>Chờ xác nhận</Text>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Text>Đã xác nhận</Text>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Text>Đang khiếu nại</Text>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Text>Đang tranh chấp</Text>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Text>Từ chối khiếu nại</Text>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED || order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Text>Hoàn trả tiền</Text>
        }
    }
    const getButtonsStatus = () => {
        if (order?.statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button danger onClick={handleOrderComplaint}>Khiếu nại</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleOrderComplete}>Xác nhận</Button>
                </Col>
            </Row>
        } else if (order?.statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn thành</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ fontSize: 14, height: 32, lineHeight: 2.2 }} color="warning">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleOrderComplete}>Xác nhận</Button>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} color="processing" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đang tranh chấp</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="red" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Từ chối khiếu nại</Tag>
                </Col>

            </Row>
        } else if (order?.statusId === ORDER_SELLER_REFUNDED || order?.statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
                </Col>

            </Row>
        }
    }
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = (info) => {
        let newFileList = [...info.fileList];

        newFileList = newFileList.slice(-5);

        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setFileList(newFileList);
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const orderDetailRef = useRef();
    const showModalFeedback = () => {
        form.resetFields();
        setFileList([])
        setIsModalOpen(true);
    };
    const handleModalFeedbackOk = () => {
        setIsModalOpen(false);
    };
    const handleModalFeedbackCancel = () => {
        setIsModalOpen(false);
    };
    const handleSubmitFeedback = (values) => {
        var formData = new FormData();
        formData.append("userId", getUserId());
        formData.append("orderId", orderId);
        formData.append("orderDetailId", orderDetailRef.current);
        formData.append("rate", values.rate);
        formData.append("content", values.content ?? "");
        if (values.images || values.images?.fileList?.length > 0) {
            values.images.fileList.forEach((v) => {
                formData.append("images", v.originFileObj);
            })
        } else {
            formData.append("imageFiles", null);
        }
        handleModalFeedbackOk()
        addFeedbackOrder(formData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    getOrderDetail();
                }
            })
            .catch((err) => {

            })
    }
    return (<>
        <Modal
            title="Đánh giá sản phẩm"
            footer={null}
            open={isModalOpen}
            onOk={handleModalFeedbackOk}
            onCancel={handleModalFeedbackCancel}>
            <Form
                form={form}
                onFinish={handleSubmitFeedback}
            >
                <Row>
                    <Col span={8} offset={1}><Text>Điểm đánh giá</Text></Col>
                    <Col span={15}>
                        <Form.Item name="rate"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value !== 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Vui lòng không để trống điểm đánh giá.'));
                                    },
                                }),
                            ]}
                        >
                            <Rate style={{
                                lineHeight: '0'
                            }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={1}><Text>Nội dung</Text></Col>
                    <Col span={15}>
                        <Form.Item name="content">
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={1}><Text>Hình ảnh</Text></Col>
                    <Col span={15}>
                        <Form.Item name="images">
                            <Upload
                                accept=".png, .jpeg, .jpg"
                                beforeUpload={false}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={5}
                            >

                                {fileList.length >= 5 ? null : <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Tải lên
                                    </div>
                                </div>}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end" gutter={[16, 0]}>
                    <Col><Button type="default" danger onClick={handleModalFeedbackCancel}>Hủy</Button></Col>
                    <Col><Button type="primary" htmlType="submit">Xác nhận</Button></Col>
                </Row>
            </Form>
        </Modal >
        <Card
            title={
                <Row>
                    <Col span={2}>
                        <Link to={"/history/order"}><LeftOutlined />Trở lại</Link>
                    </Col>
                    <Col span={22}>
                        <Row justify="end" gutter={[16, 0]}>
                            <Col><Text>Mã đơn hàng: #{order?.orderId}</Text></Col>
                            <Col>|</Col>
                            <Col><Text>Ngày đặt hàng: {ParseDateTime(order?.orderDate)}</Text></Col>
                            <Col>|</Col>
                            <Col><Text>{getTextStatusOrder()}</Text></Col>
                        </Row>
                    </Col>
                </Row>
            }
        >
            <Card
                title={<Row gutter={[8, 0]} align="bottom">
                    <Col>
                        <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
                    </Col>
                    <Col>
                        <Title level={5}>{order.shopName}</Title>
                    </Col>
                    <Col>
                        <Title level={5}>
                            <Button
                                type="default"
                                size="small"
                                icon={<ShopOutlined />}
                            >
                                Xem cửa hàng
                            </Button></Title>
                    </Col>
                    <Col>
                        <Title level={5}>

                            <Button
                                type="default"
                                size="small"
                                icon={<ChatIcon />}
                            >
                                Nhắn tin
                            </Button></Title>
                    </Col>
                </Row>}
                bordered={true}
            >
                <Row gutter={[0, 32]}>
                    {order?.orderDetails?.map((v, i) => {
                        return (
                            <Col span={24}>
                                <Row gutter={[8, 8]}>
                                    <Col flex={0}>
                                        <Link to={`/product/${v.productId}`}>
                                            <Image
                                                width={120}
                                                src={v.thumbnail}
                                                preview={false}
                                            />
                                        </Link>
                                    </Col>
                                    <Col flex={5}>
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={17}>
                                                        <Title level={5}>
                                                            {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.substring(0, 70)}...</Tooltip> : v.productName}
                                                        </Title>
                                                    </Col>
                                                    {!v.isFeedback && order.statusId === ORDER_CONFIRMED && <Col offset={1} span={6}>
                                                        <Row justify="end">
                                                            <Button type="primary" size="small" onClick={() => { orderDetailRef.current = v.orderDetailId; showModalFeedback(); }}>Đánh giá</Button>
                                                        </Row>
                                                    </Col>}
                                                    {v.isFeedback && <Col offset={1} span={6}>
                                                        <Row justify="end" gutter={[8, 0]}>
                                                            <Col>
                                                                <Text>Đánh giá</Text>
                                                            </Col>
                                                            <Col>
                                                                <Rate style={{
                                                                    fontSize: '14px',
                                                                    lineHeight: '1.2',
                                                                }} disabled value={v.feebackRate} />
                                                            </Col>
                                                        </Row>
                                                    </Col>}
                                                </Row>
                                            </Col>
                                            <Col span={24}><Text>{`Phân loại hàng: ${v.productVariantName}`}</Text></Col>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={1}>
                                                        <Text>{`x${v.quantity}`}</Text>
                                                    </Col>
                                                    <Col span={23}>
                                                        <Row justify="end">
                                                            {v.discount === 0 ?
                                                                <Text>{formatStringToCurrencyVND(v.price)}₫</Text>
                                                                :
                                                                <Space size={[8, 0]}>
                                                                    <Text delete>{formatStringToCurrencyVND(v.price)}₫</Text>
                                                                    <Text>{formatStringToCurrencyVND(v.price - (v.price * v.discount / 100))}₫</Text>
                                                                </Space>
                                                            }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        <Row gutter={[0, 0]}>
                                            <Col span={24}><Divider style={{ marginBottom: '0' }}><Title level={5}>Dữ liệu sản phẩm</Title></Divider></Col>
                                            {v?.assetInformations?.map((v, i) => (<Col span={24} key={i}>{v}</Col>))}
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        )
                    })}
                </Row>
                <Divider />
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Row justify="end">
                            {order?.totalAmount !== 0 && <Col span={24}>
                                <Row justify="end">
                                    <Col style={{ textAlign: 'right' }}><Title level={5}>Tổng tiền:</Title></Col>
                                    <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                        <Text>{formatStringToCurrencyVND(order?.totalAmount)}₫</Text>
                                    </Col>
                                </Row>
                            </Col>}

                            {order?.totalCouponDiscount !== 0 && <Col span={24}>
                                <Row justify="end">
                                    <Col style={{ textAlign: 'right' }}><Title level={5}>Mã giảm giá:</Title></Col>
                                    <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                        <Text>-{formatStringToCurrencyVND(order?.totalCouponDiscount)}₫</Text>
                                    </Col>
                                </Row>
                            </Col>}
                            {order?.totalCoinDiscount !== 0 && <Col span={24}>
                                <Row justify="end">
                                    <Col style={{ textAlign: 'right' }}><Title level={5}>Xu:</Title></Col>
                                    <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                        <Text>-{formatStringToCurrencyVND(order?.totalCoinDiscount)}₫</Text>
                                    </Col>
                                </Row>
                            </Col>}
                            <Col span={24}>
                                <Row justify="end">
                                    <Col span={5}>
                                        <Divider />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row justify="end">
                                    <Col style={{ textAlign: 'right' }}><Title level={5}>Thành tiền:</Title></Col>
                                    <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                        <Text>{`${formatStringToCurrencyVND(order.totalPayment)}₫`}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={24}>
                        {getButtonsStatus()}
                    </Col>
                </Row>

                {order.note &&
                    <Row>
                        <Col span={24}><Divider><Title level={5}>Lời nhắn</Title></Divider></Col>
                        <Col span={23}>
                            <Text>{order.note}</Text>
                        </Col>
                    </Row>
                }
            </Card>
        </Card>
    </>);
}

export default OrderDetail;