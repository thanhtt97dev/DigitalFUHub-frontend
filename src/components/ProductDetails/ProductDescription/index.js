import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { Col, Row, Skeleton, Card } from 'antd';

///
const cx = classNames.bind(styles);
///

const ProductDescription = ({ product }) => {
    return (
        <Card className={cx('margin-bottom')}>
            <Row>
                <Col span={5}>
                    <p className={cx('text-title')}>CHI TIẾT SẢN PHẨM</p>
                </Col>
                {
                    product ? <Col span={23} offset={1} style={{ display: 'flex', alignItems: 'center' }}>
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </Col> : <Skeleton active />
                }
            </Row>
        </Card>
    )
}

export default ProductDescription;