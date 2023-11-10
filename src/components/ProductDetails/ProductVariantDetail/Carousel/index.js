import React, { useRef } from 'react';
import { Carousel, Image } from 'antd';
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

function CarouselCustom({ data }) {

    /// refs
    const slider = useRef(null);
    ///

    /// styles
    const imageStyle = { height: '100%', width: '100%', borderRadius: 5 };
    const carouselStyle = { width: '100%', height: '100%' };
    ///
    return (
        <div className={cx("container")} >
            <button
                className={cx("btn-navigation-prev")}
                onClick={() => slider.current.prev()}
            >
                <div className={cx("btn-navigation-prev_img")} />
            </button>
            <Carousel
                className={cx("carousel")}
                ref={slider}
                style={carouselStyle}
                autoplay
            >
                {
                    data.map((item, index) => (
                        <div key={index} >
                            <Image
                                style={imageStyle}
                                src={item}
                            />
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
        </div>
    );
}

export default CarouselCustom;