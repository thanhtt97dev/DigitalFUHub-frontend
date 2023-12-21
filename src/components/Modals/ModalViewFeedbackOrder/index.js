import { Link } from "react-router-dom";
import { ParseDateTime } from "~/utils";
import { Button, Col, Image, Rate, Row, Typography, Modal, Avatar, Spin, } from "antd";
import userDefaultImage from '~/assets/images/user.jpg'


const { Text, Title, Paragraph } = Typography;

function ModalViewFeedbackOrder(
    { feedbackDetail,
        isModalViewFeedbackOpen,
        handleViewFeedbackOk,
        handleViewFeedbackCancel }) {
    return (<>
        <Modal title="Đánh giá cửa hàng" height={200} open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk}
            onCancel={handleViewFeedbackCancel}
            footer={[
                <Button key="close" onClick={handleViewFeedbackOk}>
                    Đóng
                </Button>,
            ]}
        >
            <Spin spinning={!feedbackDetail.length > 0}>
                <Row gutter={[0, 16]}>
                    {feedbackDetail.map((v, i) => <>
                        <Col span={24}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Link to={`/product/${v.productId}`}>
                                        <Image
                                            preview={false}
                                            width={60}
                                            height={60}
                                            src={v.thumbnail}
                                        />
                                    </Link>
                                </Col>
                                <Col flex={5}>
                                    <Row>
                                        <Col span={23}><Title level={5}>{v.productName}</Title></Col>
                                        <Col span={23}><Text>{`Phân loại: ${v.productVariantName} x ${v.quantity}`}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={23} offset={1}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Avatar size="large" src={v.avatar || userDefaultImage} />
                                </Col>
                                <Col flex={5} >
                                    <Row >
                                        <Col span={23}><Text>{v.username}</Text></Col>
                                        <Col span={23}><Rate value={v.rate} disabled style={{ fontSize: "14px" }} /></Col>
                                        <Col span={23}><Paragraph>{v.content}</Paragraph></Col>
                                        <Col span={23} >
                                            <Row gutter={[8, 8]}>
                                                {v?.urlImages?.map((url, i) => <Col>
                                                    <Image
                                                        width={80}
                                                        src={url}
                                                        preview={{
                                                            movable: false,
                                                        }}
                                                    />
                                                </Col>)}
                                            </Row>
                                        </Col>
                                        <Col span={23}><Text>{ParseDateTime(v.date)}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </>)}
                </Row>
            </Spin>
        </Modal>


    </>);
}

export default ModalViewFeedbackOrder;