import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Avatar, List, Rate, Card, Typography, Space } from 'antd';

import { search } from '~/api/feedback'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE_FEEDBACK,
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
import Spinning from "~/components/Spinning";
import userDefaultImage from '~/assets/images/user.jpg'

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
    const [selectedFeedbackType, setSelectedFeedbackType] = useState(FEEDBACK_TYPE_ALL)
    const [pagination, setPagination] = useState({
        pageSize: PAGE_SIZE_FEEDBACK,
    });
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
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
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setSelectedFeedbackType(FEEDBACK_TYPE_ALL)
    }

    const handleSearchOneStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_1_STAR
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_1_STAR)
    }

    const handleSearchTwoStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_2_STAR
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_2_STAR)
    }

    const handleSearchThreeStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_3_STAR
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_3_STAR)
    }

    const handleSearchFourStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_4_STAR
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_4_STAR)
    }

    const handleSearchFiveStar = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_5_STAR
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_5_STAR)
    }

    const handleSearchHaveComment = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_HAVE_COMMENT
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_HAVE_COMMENT)
    }

    const handleSearchHaveMedia = () => {
        setSearchParams({
            ...searchParams,
            page: 1,
            type: FEEDBACK_TYPE_HAVE_MEDIA
        })
        setSelectedFeedbackType(FEEDBACK_TYPE_HAVE_MEDIA)
    }



    return (
        <Spinning spinning={loading}>
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
                            selectedType={selectedFeedbackType}
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
                                                avatar={
                                                    item.userAvatar !== "" ?
                                                        <Avatar size="large" src={item.userAvatar} />
                                                        :
                                                        <Avatar src={userDefaultImage} />
                                                }
                                                description={<>
                                                    <Row>
                                                        <span style={{ fontSize: 14 }}>
                                                            <Link
                                                                to={`/shop/${item.userId}`}
                                                                style={{ color: "#000000de", fontSize: "1rem" }}
                                                            >
                                                                {item.fullName}
                                                            </Link>
                                                        </span>
                                                    </Row>
                                                    <Row>
                                                        <Rate disabled defaultValue={item.rate} style={{ fontSize: "1rem", }} />
                                                    </Row>
                                                    <Row>
                                                        <Space style={{ fontSize: "1rem", color: "#0000008a" }}>
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
        </Spinning>
    )
}

export default ProductFeedback;