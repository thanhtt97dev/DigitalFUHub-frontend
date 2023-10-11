import React, { useRef } from 'react';
import { Carousel, Image } from 'antd';
import classNames from 'classnames/bind';

import styles from './CarouselCustom.module.scss';
const cx = classNames.bind(styles);

function CarouselCustom({ data, style, callback }) {

    const slider = useRef(null);

    const imageStyle = {
        height: '50vh',
        borderRadius: 5
    };

    const containerImageStyle = { width: '100%', textAlign: 'center' }

    return (
        <div className={cx("container")}>
            <button
                className={cx("btn-navigation-prev")}
                onClick={() => slider.current.prev()}
            >
                <div className={cx("btn-navigation-prev_img")} />
            </button>
            <Carousel
                className={cx("carousel")}
                ref={slider}
                style={style}
                autoplay
            >
                {/* {data.map((x, index) => {
                    return <Image src={x} alt='product-img' />
                })} */}

                {
                    data.map((item, index) => (
                        <div key={index} >
                            <div style={containerImageStyle}>
                                <Image
                                    style={imageStyle}
                                    src={item}
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
        </div>
    );
}

export default CarouselCustom;