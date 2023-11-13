import React, { useState } from "react";
import { Col, Row, Image, Skeleton, Avatar, List, Rate, Card, Typography, Space } from 'antd';
import CarouselFeedbackMedia from "~/components/ProductDetails/ProductFeedbackMedia/CarouselFeedbackMedia";

function ProductFeedbackMedia({ feedbackMedias }) {

    const [openCarousel, setOpenCarousel] = useState(false)

    const handleOpenCarousel = () => {
        setOpenCarousel(true)
    }

    const handleCloseCarousel = () => {
        setOpenCarousel(false)
    }

    return (
        <>
            {feedbackMedias ?
                <div>
                    {feedbackMedias?.map((item, index) => (
                        <div style={{ padding: 5 }} key={index}>
                            <img
                                style={{
                                    backgroundPosition: "50%",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    width: "4.5rem",
                                    height: "4.5rem",
                                    cursor: "zoom-in",
                                }}
                                onClick={handleOpenCarousel}
                                src={item}
                                alt="feedbackImage"
                            />
                        </div>
                    ))}
                    {openCarousel === true ?
                        <CarouselFeedbackMedia
                            data={feedbackMedias}
                        />
                        :
                        <></>
                    }

                </div>
                :
                <></>
            }
        </>
    );
}

export default ProductFeedbackMedia;