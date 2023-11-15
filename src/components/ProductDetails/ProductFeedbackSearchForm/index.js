import React, { useState } from "react";
import { Card, Space, Button, Rate } from "antd";

import {
    FEEDBACK_TYPE_ALL,
    FEEDBACK_TYPE_1_STAR,
    FEEDBACK_TYPE_2_STAR,
    FEEDBACK_TYPE_3_STAR,
    FEEDBACK_TYPE_4_STAR,
    FEEDBACK_TYPE_5_STAR,
    FEEDBACK_TYPE_HAVE_COMMENT,
    FEEDBACK_TYPE_HAVE_MEDIA
} from '~/constants'


function SearchItem({ text, callBack, selected }) {
    return (
        <Button danger={selected} onClick={callBack} size="large">{text}</Button>
    );
}

function ProductFeedbackSearchForm({
    product,
    selectedType,
    handleSearchAll,
    handleSearchOneStar,
    handleSearchTwoStar,
    handleSearchThreeStar,
    handleSearchFourStar,
    handleSearchFiveStar,
    handleSearchHaveComment,
    handleSearchHaveMedia,
}) {

    const feedBackGeneralInfo = product.feedBackGeneralInfo;

    console.log(selectedType)

    return (
        <>
            {product ?
                <Card
                    style={{ width: "100vw", backgroundColor: "#fffbf8" }}
                >
                    <Space>
                        <div style={{ width: "10vw", color: "#ee4d2d" }}>
                            <div>
                                <span style={{ fontSize: "1.875rem" }}>
                                    {(feedBackGeneralInfo.totalRatingStar / feedBackGeneralInfo.totalFeedback).toFixed(2)}
                                </span>
                                <span style={{ fontSize: "1.125rem", marginLeft: "0.5rem" }}>
                                    trên 5
                                </span>
                            </div>
                            <Rate disabled defaultValue={feedBackGeneralInfo.totalRatingStar / feedBackGeneralInfo.totalFeedback} />
                        </div>
                        <Space direction="vertical">
                            <Space>
                                <SearchItem text={`Tất cả (${feedBackGeneralInfo.totalFeedback})`} callBack={handleSearchAll} selected={selectedType === FEEDBACK_TYPE_ALL} />
                                <SearchItem text={`5 Sao (${feedBackGeneralInfo.totalFeedbackFiveStar})`} callBack={handleSearchFiveStar} selected={selectedType === FEEDBACK_TYPE_5_STAR} />
                                <SearchItem text={`4 Sao (${feedBackGeneralInfo.totalFeedbackFourStar})`} callBack={handleSearchFourStar} selected={selectedType === FEEDBACK_TYPE_4_STAR} />
                                <SearchItem text={`3 Sao (${feedBackGeneralInfo.totalFeedbackThreeStar})`} callBack={handleSearchThreeStar} selected={selectedType === FEEDBACK_TYPE_3_STAR} />
                                <SearchItem text={`2 Sao (${feedBackGeneralInfo.totalFeedbackTwoStar})`} callBack={handleSearchTwoStar} selected={selectedType === FEEDBACK_TYPE_2_STAR} />
                                <SearchItem text={`1 Sao (${feedBackGeneralInfo.totalFeedbackOneStar})`} callBack={handleSearchOneStar} selected={selectedType === FEEDBACK_TYPE_1_STAR} />
                            </Space>
                            <Space>
                                <SearchItem text={`Có bình luận (${feedBackGeneralInfo.totalFeedbackHaveComment})`} callBack={handleSearchHaveComment} selected={selectedType === FEEDBACK_TYPE_HAVE_COMMENT} />
                                <SearchItem text={`Có hình ảnh (${feedBackGeneralInfo.totalFeedbackHaveMedia})`} callBack={handleSearchHaveMedia} selected={selectedType === FEEDBACK_TYPE_HAVE_MEDIA} />
                            </Space>
                        </Space>
                    </Space>
                </Card>
                :
                <></>
            }
        </>
    );
}

export default ProductFeedbackSearchForm;