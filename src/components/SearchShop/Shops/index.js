import { ClockCircleOutlined, ShoppingOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Pagination, Row, Space } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../SearchProduct/SearchProduct.module.scss"
import { PAGE_SIZE_SEARCH_SHOP } from "~/constants";
import { formatNumber } from "~/utils";
const cx = classNames.bind(styles);
function Shops({ listShop = [], totalItems = 0, keyword = '', page = 1, onSelectPage = () => { } }) {
    return (<>
        <div style={{ marginBottom: '1em' }}>
            <span
                style={{
                    fontSize: 16
                }}>
                Cửa hàng liên quan đến
                '<span style={{ color: '#1677ff' }}>{keyword}</span>'
            </span>
        </div>
        {listShop.map((value, index) => <Space
            direction="vertical"
            style={{ marginBottom: '1em', width: '100%' }}
        >
            <Link to={`/shop/${value.userId}`}>
                <Card>
                    <Row>
                        <Col span={8} style={{ paddingInlineEnd: '0.8em', borderRight: '1px solid rgb(232, 232, 232)' }}>
                            <Space>
                                <Avatar size={60} src={value.avatar} />
                                <div>
                                    <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '18px' }}>{value.shopName}</div>
                                    <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '14px' }}>{value.username}</div>
                                </div>
                            </Space>
                        </Col>
                        <Col span={16}>
                            <Row justify="end" style={{ height: '100%' }}>
                                <Space size={[84, 8]} align="center">
                                    <div>Sản phẩm: {formatNumber(value.productNumber)} <ShoppingOutlined /></div>
                                    <div>Đánh giá: {value.numberFeedback === 0 ? 0 : (value.totalRatingStar / value.numberFeedback).toFixed(1)} <StarOutlined /></div>
                                    <div>Tham gia: {moment(value.dateCreate).fromNow()} <ClockCircleOutlined /></div>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </Space >)}
        <Row className={cx('flex-item-center', 'margin-top-40')}>
            <Pagination
                hideOnSinglePage
                current={page}
                defaultCurrent={1}
                total={totalItems}
                pageSize={PAGE_SIZE_SEARCH_SHOP}
                onChange={onSelectPage}
            />
        </Row>
    </>);
}

export default Shops;