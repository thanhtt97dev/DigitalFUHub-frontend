import React, { useRef } from 'react';
import { Carousel } from 'antd';
import classNames from 'classnames/bind';

import styles from './CarouselCustom.module.scss';
const cx = classNames.bind(styles);

function CarouselCustom({ data, style, callback }) {

    const slider = useRef(null);

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
            >
                {data.map((x) => {
                    return <img src={x} alt='product-img' />
                })}
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