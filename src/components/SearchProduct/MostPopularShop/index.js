import { Link } from "react-router-dom";
import { Avatar, Card, Col, Row, Space } from 'antd';
import classNames from "classnames/bind";
import { ClockCircleOutlined, ShoppingOutlined, StarOutlined } from "@ant-design/icons";
import styles from "../SearchProduct.module.scss"
import moment from "moment";
import { formatNumber } from "~/utils";
const cx = classNames.bind(styles);
function MostPopularShop({ mostPopularShop, keyword }) {
    return (<>
        {
            mostPopularShop ?
                <Space
                    direction="vertical"
                    style={{ marginBottom: '1em', width: '100%' }}
                >
                    <div style={{ marginBottom: '1em' }}>
                        <span
                            style={{
                                fontSize: 16
                            }}>
                            Cửa hàng liên quan đến
                            '<span style={{ color: '#1677ff' }}>{keyword}</span>'
                        </span>
                    </div>
                    <Link to={`/shop/${mostPopularShop.userId}`}>
                        <Card hoverable>
                            <Row>
                                <Col span={8} style={{ paddingInlineEnd: '0.8em', borderRight: '1px solid rgb(232, 232, 232)' }}>
                                    <Space>
                                        <Avatar size={60} src={mostPopularShop.avatar} />
                                        <div>
                                            <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '18px' }}>{mostPopularShop.shopName}</div>
                                            <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '14px' }}>{mostPopularShop.username}</div>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={16}>
                                    <Row justify="end" style={{ height: '100%' }}>
                                        <Space size={[84, 8]} align="center">
                                            <div>Sản phẩm: {formatNumber(mostPopularShop.productNumber)} <ShoppingOutlined /></div>
                                            <div>Đánh giá: {mostPopularShop.numberFeedback === 0 ? 0 : (mostPopularShop.totalRatingStar / mostPopularShop.numberFeedback).toFixed(1)} <StarOutlined /></div>
                                            <div>Tham gia: {moment(mostPopularShop.dateCreate).fromNow()} <ClockCircleOutlined /></div>
                                        </Space>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Link>
                </Space >
                :
                null
        }
    </>
    )
}
export default MostPopularShop;