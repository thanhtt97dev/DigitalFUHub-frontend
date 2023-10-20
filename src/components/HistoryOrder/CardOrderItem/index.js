import {
    ShopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
    PlusOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Form, Image, Modal, Rate, Row, Space, Tag, Tooltip, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_CONFIRMED, ORDER_WAIT_CONFIRMATION, ORDER_COMPLAINT, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_VIOLATES, ORDER_SELLER_REFUNDED } from "~/constants";
import { formatStringToCurrencyVND, getDistanceDayTwoDate, getUserId } from "~/utils";

const { Text, Title } = Typography;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function CardOrderItem({
    orderId,
    note,
    orderDate,
    shopId,
    shopName,
    statusId,
    totalAmount,
    totalCoinDiscount,
    totalCouponDiscount,
    totalPayment,
    orderDetails,
    onOrderComplete = () => { },
    onOrderComplaint = () => { },
    onFeedback = () => { },
    onViewFeedback = () => { }
}) {
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

    const getButtonsStatus = () => {
        if (statusId === ORDER_WAIT_CONFIRMATION) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Button danger onClick={onOrderComplaint}>Khiếu nại</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={onOrderComplete}>Xác nhận</Button>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_CONFIRMED) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<CheckCircleOutlined size={16} />} color="blue" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn thành</Tag>
                </Col>
                {orderDetails.some((v, i) => v.isFeedback === true) ?
                    <Col>
                        <Button type="default" onClick={onViewFeedback}>Xem đánh giá</Button>
                    </Col>
                    : ''
                }
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} style={{ fontSize: 14, height: 32, lineHeight: 2.2 }} color="warning">Đang khiếu nại</Tag>
                </Col>
                <Col>
                    <Button type="primary" onClick={onOrderComplete}>Xác nhận</Button>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_DISPUTE) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag icon={<SyncOutlined size={16} spin />} color="processing" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Đang tranh chấp</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_REJECT_COMPLAINT) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="red" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Từ chối khiếu nại</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        } else if (statusId === ORDER_SELLER_REFUNDED || statusId === ORDER_SELLER_VIOLATES) {
            return <Row justify="end" gutter={[8]}>
                <Col>
                    <Tag color="cyan" style={{ fontSize: 14, height: 32, lineHeight: 2.2 }}>Hoàn lại tiền</Tag>
                </Col>
                <Col>
                    <Link to={`/history/order/${orderId}`}>
                        <Button type="default">Chi tiết</Button>
                    </Link>
                </Col>
            </Row>
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const orderDetailRef = useRef();
    const showModalFeedback = () => {
        setFileList([])
        form.resetFields();
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
        if (values.imageFiles || values.imageFiles?.fileList?.length > 0) {
            values.imageFiles.fileList.forEach((v) => {
                formData.append("imageFiles", v.originFileObj);
            })
        } else {
            formData.append("imageFiles", null);
        }
        handleModalFeedbackOk()
        onFeedback(formData);
    }

    return <>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
                alt="preview"
                style={{
                    width: '100%',
                }}
                src={previewImage}
            />
        </Modal>
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
                        <Form.Item name="imageFiles">
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
            title={<Row gutter={[8, 0]} align="bottom">
                <Col>
                    <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
                </Col>
                <Col>
                    <Title level={5}>{shopName}</Title>
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
                    <Link to="/chatBox">
                        <Title level={5}>
                            <Button
                                type="default"
                                size="small"
                                icon={<MessageOutlined />}
                            >
                                Nhắn tin
                            </Button></Title>
                    </Link>
                </Col>
            </Row>}
            bordered={true}
        >
            <Row gutter={[0, 16]}>
                {orderDetails.map((v, i) => {
                    return (<Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col flex={0}>
                                <Link to={`/product/${v.productId}`}>
                                    <Image
                                        width={120}
                                        height={75}
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
                                                    {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.slice(0, 70)}...</Tooltip> : v.productName}
                                                </Title>
                                            </Col>
                                            {!v.isFeedback && statusId === ORDER_CONFIRMED && getDistanceDayTwoDate(orderDate, new Date()) <= 7 && <Col offset={1} span={6}>
                                                <Row justify="end">
                                                    <Button type="primary" size="small" onClick={() => { orderDetailRef.current = v.orderDetailId; showModalFeedback(); }}>Đánh giá</Button>
                                                </Row>
                                            </Col>
                                            }
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

                        </Row>
                    </Col>
                    )
                })}
            </Row>
            <Divider />
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Row justify="end">
                        <Col span={24}>
                            <Row justify="end">
                                <Col style={{ textAlign: 'right' }}><Title level={5}>Thành tiền:</Title></Col>
                                <Col span={3} offset={0.5} style={{ textAlign: 'right' }}>
                                    <Text>{`${formatStringToCurrencyVND(totalPayment)}đ`}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>
                <Col span={24}>
                    {getButtonsStatus()}
                </Col>
            </Row>
        </Card>

    </>;
}

export default memo(CardOrderItem);