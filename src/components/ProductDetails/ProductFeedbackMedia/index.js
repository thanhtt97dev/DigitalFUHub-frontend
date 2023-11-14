import React from "react";
import { Image } from 'antd';

function ProductFeedbackMedia({ feedbackMedias }) {
    return (
        <>
            {feedbackMedias ?
                <>
                    {feedbackMedias?.map((item, index) => (
                        <div style={{ padding: 5 }} key={index}>
                            <Image
                                style={{
                                    backgroundPosition: "50%",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    width: "4.5rem",
                                    height: "4.5rem",
                                    cursor: "zoom-in",
                                }}
                                src={item}
                                alt="feedbackImage"
                            />
                        </div>
                    ))}
                </>
                :
                <></>
            }
        </>
    );
}

export default ProductFeedbackMedia;