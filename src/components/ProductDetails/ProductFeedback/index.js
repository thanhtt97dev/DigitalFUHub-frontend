import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { Col, Row, Image, Skeleton, Avatar, List, Rate, Card, Typography } from 'antd';

const { Title } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const FormatFeedbackMedias = ({ feedbackMedias }) => (
    feedbackMedias?.map((item, index) => (
        <div style={{ padding: 5 }} key={index}>
            <Image
                width={70}
                src={item.url}
            />
        </div>
    ))
)

const ProductFeedback = ({ feedback, product }) => {

    return (
        <Card className={cx('margin-bottom')}>
            <Row>
                <Col span={5}>
                    <Title level={4}>Đánh giá sản phẩm</Title>
                </Col>
            </Row>
            <div>
                {
                    product && feedback ? (
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                pageSize: 5,
                            }}
                            dataSource={feedback}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.user.email}
                                >
                                    <Row>
                                        <List.Item.Meta
                                            avatar={<Avatar size="large" src={item.user.avatar} />}
                                            title={
                                                <>
                                                    <Row><span style={{ fontSize: 14 }}>{item.user.email}</span></Row>
                                                    <Row><Rate disabled defaultValue={item.rate} style={{ fontSize: 12, width: '15vh' }} /></Row>
                                                </>

                                            }
                                            description={moment(item.updateAt).format('HH:mm - DD/MM')}
                                        />

                                    </Row>
                                    <Row style={{ marginLeft: '9vh', marginBottom: '2vh' }}>
                                        {item.content}
                                    </Row>
                                    <Row style={{ marginLeft: '8vh' }}>
                                        <FormatFeedbackMedias feedbackMedias={item.feedbackMedias} />
                                    </Row>

                                </List.Item>
                            )}
                        />
                    ) : (<Skeleton active />)
                }
            </div>
        </Card>
    )
}

export default ProductFeedback;