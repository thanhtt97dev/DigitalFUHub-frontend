import React, { useRef } from 'react';
import { Carousel, Image, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind';

import styles from './CarouselFeedbackMedia.scss';
const cx = classNames.bind(styles);

function CarouselFeedbackMedia({ data, style, imageStyle, callback }) {

    const slider = useRef(null);

    const containerImageStyle = { width: '50%', textAlign: 'center' }

    return (
        <div className={cx("container")}>
            <button
                className={cx("btn-close")}
                onClick={() => slider.current.prev()}
            >
                <Tooltip
                    title={"Đóng"}
                    placement='top'
                >
                    <CloseOutlined style={{ fontSize: "20px" }} />
                </Tooltip>

            </button>
            <>
                <button
                    className={cx("btn-navigation-prev")}
                    onClick={() => slider.current.prev()}
                >
                    <div className={cx("btn-navigation-prev_img")} />
                </button>
                <Carousel
                    className={cx("carousel")}
                    ref={slider}
                    autoplay
                >
                    {
                        data.map((item, index) => (
                            <div key={index} >
                                <div>
                                    <img
                                        style={{
                                            width: "50%",
                                            height: "50%"
                                        }}
                                        src={item}
                                        alt='feeback'
                                    />
                                </div>
                            </div>

                        ))
                    }
                </Carousel>
                <button
                    className={cx("btn-navigation-next")}
                    onClick={() => slider.current.next()}
                >
                    <div className={cx("btn-navigation-next_img")} />
                </button>
            </>
        </div>
    );
}

export default CarouselFeedbackMedia;