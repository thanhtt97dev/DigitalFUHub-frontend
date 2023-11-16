import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ShopDetail/ShopDetail.module.scss';
import { Col, Row, Card } from 'antd';


///
const cx = classNames.bind(styles);
///

/// styles
const styleCardDetailDes = { borderRadius: 2, boxShadow: '#d3d3d3 0px 1px 2px 0px' };
const styleBodyCardDetailDes = { padding: 20 };
const styleContentDes = { display: 'flex', alignItems: 'center' };
///



const DetailedDescription = ({ shop }) => {


    return (
        <div className={cx('container-page-detail')}>
            <Card className={cx('margin-bottom-10')} style={styleCardDetailDes} bodyStyle={styleBodyCardDetailDes} >
                <Row>
                    <Col span={5}>
                        <p className={cx('text-title')}>THÔNG TIN CỬA HÀNG</p>
                    </Col>
                    <Col span={23}
                        offset={1}
                        style={styleContentDes}
                    >
                        <div dangerouslySetInnerHTML={{ __html: shop.description }} />
                    </Col>
                </Row>
            </Card>
        </div>)
}

export default DetailedDescription;