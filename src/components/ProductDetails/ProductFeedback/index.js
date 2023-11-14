import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Avatar, List, Rate, Card, Typography, Space } from 'antd';

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

import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import ProductFeedbackMedia from "../ProductFeedbackMedia";
import ProductFeedbackSearchForm from "../ProductFeedbackSearchForm";

const { Title } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const ProductFeedback = ({ product }) => {

    const { id } = useParams();

    const [searchParams, setSearchParams] = useState({
        productId: id,
        type: FEEDBACK_TYPE_ALL,
        page: 1
    })
    const [pagination, setPagination] = useState({
        pageSize: 5,
    });
    const [data, setData] = useState(null)

    useEffect(() => {
        search(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    var data = res.data.result;
                    setData(data.feedbacks);
                    setPagination({
                        ...pagination,
                        total: data.totalFeedback
                    })
                }
            }).catch((err) => {

            })
    }, [searchParams, product])

    const handleListChange = (currentPage) => {
        setSearchParams({
            ...searchParams,
            page: currentPage
        })
    };

    const handleSearchAll = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_ALL
        })
    }

    const handleSearchOneStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_1_STAR
        })
    }

    const handleSearchTwoStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_2_STAR
        })
    }
    const handleSearchThreeStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_3_STAR
        })
    }

    const handleSearchFourStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_4_STAR
        })
    }
    const handleSearchFiveStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_5_STAR
        })
    }

    const handleSearchHaveComment = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_HAVE_COMMENT
        })
    }

    const handleSearchHaveMedia = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_HAVE_MEDIA
        })
    }



    return (
        <>
            {product ?
                <Card className={cx('margin-bottom')}>
                    <Row>
                        <Col span={5}>
                            <Title level={4}>Đánh giá sản phẩm</Title>
                        </Col>
                    </Row>

                    <Row>
                        <ProductFeedbackSearchForm
                            product={product}
                            handleSearchAll={handleSearchAll}
                            handleSearchOneStar={handleSearchOneStar}
                            handleSearchTwoStar={handleSearchTwoStar}
                            handleSearchThreeStar={handleSearchThreeStar}
                            handleSearchFourStar={handleSearchFourStar}
                            handleSearchFiveStar={handleSearchFiveStar}
                            handleSearchHaveComment={handleSearchHaveComment}
                            handleSearchHaveMedia={handleSearchHaveMedia}
                        />
                    </Row>

                    <Row>
                        {data !== null ?
                            <List
                                itemLayout="vertical"
                                size="large"
                                pagination={{
                                    ...pagination,
                                    onChange: (page) => handleListChange(page)
                                }}
                                dataSource={data}
                                style={{ width: "100vw" }}
                                renderItem={(item) => (
                                    <List.Item
                                        key={item.feedbackId}
                                    >
                                        <Row>
                                            <List.Item.Meta
                                                avatar={<Avatar size="large" src={item.userAvatar} />}
                                                description={<>
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
                                                </>}
                                            />

                                        </Row>
                                        <Row style={{ marginLeft: '55px', marginBottom: '2vh' }}>
                                            {item.content}
                                        </Row>
                                        <Row style={{ marginLeft: '55px' }}>
                                            <ProductFeedbackMedia feedbackMedias={item.feedbackMedias} />
                                        </Row>

                                    </List.Item>
                                )}
                            />
                            :
                            <></>
                        }
                    </Row>
                </Card>
                :
                <></>
            }
        </>
    )
}

export default ProductFeedback;