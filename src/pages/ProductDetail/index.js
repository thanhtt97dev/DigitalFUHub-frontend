import React, { useState } from "react"
import { Col, Row, Image, Button, Typography, Divider } from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss'
import { HeartOutlined, BellOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);
const { Title, Text, Link } = Typography;


const ProductDetail = () => {
    const [product, setProduct] = useState('')

    return (
        <>
            <Row>
                <Col span={10}
                    style={{ padding: 10 }}
                >
                    <div id="image-product">
                        <Image style={{ borderRadius: 10 }}
                            src="https://cdn.divineshop.vn/image/catalog/Anh-SP/Spotify/Divine-Shop-Goi-Gia-Han-Spotify-1-Nam-40567.jpg?hash=1658742748"
                        />
                        <Button>Xem thêm ảnh</Button>
                    </div>
                </Col>
                <Col span={14}
                    style={{ padding: 10 }}
                >
                    <div>
                        <Title level={3}>Tài khoản nghe nhạc Spotify Premium (1 năm)</Title>
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <Text strong>Tình trạng: </Text>
                            &nbsp;&nbsp;
                            <Text type="danger" strong>Hết hàng</Text>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <Text strong>Thể loại: </Text>
                            &nbsp;&nbsp;
                            <div>
                                <Link href="https://ant.design" target="_blank">
                                    App,
                                </Link>
                                &nbsp;
                                <Link href="https://ant.design" target="_blank">
                                    Giải trí,
                                </Link>
                                &nbsp;
                                <Link href="https://ant.design" target="_blank">
                                    Spotify,
                                </Link>
                                &nbsp;
                                <Link href="https://ant.design">
                                    Nghe nhạc
                                </Link>
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <Title level={4}>25.000đ</Title>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và đăng ký nhận thông báo khi sản phẩm giảm giá"><BellOutlined /></Button>
                            &nbsp;&nbsp;
                            <Button title="Đăng nhập và thêm vào danh sách yêu thích"><HeartOutlined /></Button>
                        </div>
                        <div
                            style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}
                        >
                            <Text delete strong type="secondary"
                                style={{ fontSize: 15 }}
                            >59.000đ</Text>
                            <div className={cx('red-box')}><p className={cx('text-discount')}>-58%</p></div>
                        </div>
                        <Divider />
                        <div>
                            <Title level={4}>Chọn thời hạn</Title>
                            <div className={cx('grid-container')}>
                                <div className={cx('grid-item')}><Button>TK 1 Tuần</Button></div>
                                <div className={cx('grid-item')}><Button>TK 1 Tháng</Button></div>
                                <div className={cx('grid-item')}><Button>TK 3 Tháng</Button></div>
                                <div className={cx('grid-item')}><Button>TK 4 Tháng</Button></div>
                                <div className={cx('grid-item')}><Button>TK Nghe nhạc khác</Button></div>
                                <div className={cx('grid-item')}><Button>TK 4 Tháng</Button></div>
                                <div className={cx('grid-item')}><Button>TK 4 Tháng</Button></div>
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>
        </>
    )
}

export default ProductDetail

