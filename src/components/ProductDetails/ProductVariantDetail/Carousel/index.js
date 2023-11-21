import React, { useRef } from 'react';
import { Carousel } from 'antd';
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

///
const cx = classNames.bind(styles);
///

/// styles
const imageStyle = { width: '100%', height: 450, borderRadius: 2 };
const carouselStyle = { width: '100%', height: 450 };
///

function CarouselCustom({ data }) {

    /// refs
    const slider = useRef(null);
    ///

    return (
        <div style={{ width: 450, height: 450, position: 'relative' }}>
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
                            <img
                                style={imageStyle}
                                src={item}
                                alt='product'
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