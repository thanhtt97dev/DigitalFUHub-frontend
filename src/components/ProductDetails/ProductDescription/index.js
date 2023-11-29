import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { Skeleton, Card } from 'antd';

///
const cx = classNames.bind(styles);
///

const ProductDescription = ({ product }) => {
    return (
        <Card className={cx('margin-bottom')}>
            <p className={cx('text-title')} style={{ fontSize: 20, marginBottom: 15 }}>CHI TIẾT SẢN PHẨM</p>
            {
                product ? <div className={cx('product-description')} dangerouslySetInnerHTML={{ __html: product.description }} /> : <Skeleton active />
            }
        </Card>
    )
}

export default ProductDescription;