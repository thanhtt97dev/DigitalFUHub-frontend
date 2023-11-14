import React from "react";
import { Card, Space, Button, Rate } from "antd";

function SearchItem({ text, callBack }) {
    return (
        <Button onClick={callBack} size="large">{text}</Button>
    );
}

function ProductFeedbackSearchForm({
    product,
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
                                    {feedBackGeneralInfo.totalRatingStar / feedBackGeneralInfo.totalFeedback}
                                </span>
                                <span style={{ fontSize: "1.125rem", marginLeft: "0.2rem" }}>
                                    trên 5
                                </span>
                            </div>
                            <Rate disabled defaultValue={feedBackGeneralInfo.totalRatingStar / feedBackGeneralInfo.totalFeedback} />
                        </div>
                        <Space direction="vertical">
                            <Space>
                                <SearchItem text={`Tất cả (${feedBackGeneralInfo.totalFeedback})`} callBack={handleSearchAll} />
                                <SearchItem text={`5 Sao (${feedBackGeneralInfo.totalFeedbackFiveStar})`} callBack={handleSearchFiveStar} />
                                <SearchItem text={`4 Sao (${feedBackGeneralInfo.totalFeedbackFourStar})`} callBack={handleSearchFourStar} />
                                <SearchItem text={`3 Sao (${feedBackGeneralInfo.totalFeedbackThreeStar})`} callBack={handleSearchThreeStar} />
                                <SearchItem text={`2 Sao (${feedBackGeneralInfo.totalFeedbackTwoStar})`} callBack={handleSearchTwoStar} />
                                <SearchItem text={`1 Sao (${feedBackGeneralInfo.totalFeedbackOneStar})`} callBack={handleSearchOneStar} />
                            </Space>
                            <Space>
                                <SearchItem text={`Có bình luận (${feedBackGeneralInfo.totalFeedbackHaveComment})`} callBack={handleSearchHaveComment} />
                                <SearchItem text={`Có hình ảnh (${feedBackGeneralInfo.totalFeedbackHaveMedia})`} callBack={handleSearchHaveMedia} />
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