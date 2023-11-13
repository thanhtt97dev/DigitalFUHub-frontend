import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Image, Skeleton, Avatar, List, Rate, Card, Typography, Space } from 'antd';

import { search } from '~/api/feedback'
import {
    RESPONSE_CODE_SUCCESS,
    FEEDBACK_TYPE_ALL,
    FEEDBACK_TYPE_1_STAR,
    FEEDBACK_TYPE_2_STAR,
    FEEDBACK_TYPE_3_STAR,
    FEEDBACK_TYPE_4_STAR,
    FEEDBACK_TYPE_5_STAR,
    FEEDBACK_TYPE_HAVE_COMMENT,
    FEEDBACK_TYPE_HAVE_MEDIA
} from '~/constants'
import { ParseDateTime } from "~/utils";

import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

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

const ProductFeedback = ({ product }) => {

    const [searchParams, setSearchParams] = useState({
        productId: 0,
        type: FEEDBACK_TYPE_ALL,
        page: 1
    })
    const [data, setData] = useState([])
    const [generalInfo, setGeneralInfo] = useState(null);

    useEffect(() => {
        search(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    var data = res.data.result;
                    setData(data);

                }
            }).catch((err) => {

            })
    }, [searchParams, product])


    return (
        <Card className={cx('margin-bottom')}>
            <Row>
                <Col span={5}>
                    <Title level={4}>Đánh giá sản phẩm</Title>
                </Col>
            </Row>
            <div>
                {
                    product && data ? (
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                pageSize: 5,
                            }}
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.feedbackId}
                                >
                                    <Row>
                                        <List.Item.Meta
                                            avatar={<Avatar size="large" src={item.userAvatar} />}
                                            title={
                                                <>
                                                    <Row>
                                                        <span style={{ fontSize: 14 }}>
                                                            <Link
                                                                to={`/shop/${item.userId}`}
                                                                style={{ color: "#000000de", fontSize: ".75rem" }}
                                                            >
                                                                {"daw"}
                                                            </Link>
                                                        </span>
                                                    </Row>
                                                    <Row>
                                                        <Rate disabled defaultValue={item.rate} style={{ fontSize: ".8rem", }} />
                                                    </Row>
                                                    <Row>
                                                        <Space style={{ fontSize: ".75rem", color: "#0000008a" }}>
                                                            <span>{moment(item.dateUpdate).format('yyyy-MM-DD - HH:mm')}</span>
                                                            <span>|</span>
                                                            <span>Phân loại hàng: {item.productVariantName}</span>
                                                        </Space>
                                                    </Row>
                                                </>

                                            }
                                        />

                                    </Row>
                                    <Row style={{ marginLeft: '55px', marginBottom: '2vh' }}>
                                        {item.content}
                                    </Row>
                                    <Row style={{ marginLeft: '55px' }}>
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