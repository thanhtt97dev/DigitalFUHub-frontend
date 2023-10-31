import React from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { addConversation } from '~/api/chat';
import { formatNumberToK, getVietnamCurrentTime, getUserId } from '~/utils';
import { Link, useNavigate } from 'react-router-dom';
import { MessageOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { Col, Row, Button, Skeleton, Avatar, Card, Space, Typography } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"


const { Title, Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const ShopInfomations = ({ product, userId }) => {

    /// navigates
    const navigate = useNavigate();
    ///

    /// styles
    const styleFirstCard = {
        borderRadius: '6px 0 0 6px'
    }

    const styleLastCard = {
        borderRadius: '0 6px 6px 0'
    }
    ///

    /// handles
    const handleSendMessage = () => {
        if (userId === undefined) {
            navigate('/login')
            return;
        } else {

            const dataAddConversation = {
                dateCreate: getVietnamCurrentTime(),
                UserId: userId,
                RecipientIds: [product.shop.shopId]
            }
            addConversation(dataAddConversation)
                .then((res) => {
                    if (res.status === 200) {
                        navigate('/chatBox', { state: { data: res.data } })
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    ///


    return (<>
        {
            product ? (

                <Row className={cx('margin-bottom')}>
                    <Col span={7}>
                        <Card style={styleFirstCard}>
                            <Row>
                                <Col className={cx('flex-item-center')}>
                                    <Avatar size={64} icon={<UserOutlined />} />
                                </Col>
                                <Col className={cx('padding-left-element')}>
                                    <Space direction='vertical'>
                                        <Link><Title level={4}>{product.shop.shopName}</Title></Link>
                                        {(() => {
                                            if (product.shop.isOnline) {
                                                return (
                                                    <div><FontAwesomeIcon icon={faCircle} style={{ color: "#00a400" }} /> Online</div>
                                                )
                                            } else {
                                                return (
                                                    <p>Online {moment(product.shop.lastTimeOnline).fromNow()}</p>
                                                )
                                            }
                                        })()}
                                        <Space direction='horizontal'>
                                            <Button icon={<ShopOutlined />} type="primary" danger ghost>Xem Shop</Button>
                                            <Button disabled={userId !== product.shop.shopId ? false : true} className={cx('margin-element')} icon={<MessageOutlined />} size={'large'} onClick={handleSendMessage} style={{ marginLeft: 10 }}>
                                                Chat ngay
                                            </Button>

                                        </Space>
                                    </Space>

                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Đánh giá</Title>
                            <Link><Text type="danger">{formatNumberToK(product.shop.feedbackNumber)}</Text></Link>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Sản phẩm</Title>
                            <Link><Text type="danger">{formatNumberToK(product.shop.productNumber)}</Text></Link>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card className={cx('flex-item-center', 'card-shop-info')} style={styleLastCard} bodyStyle={{ textAlign: 'center' }}>
                            <Title level={5}>Tham gia</Title>
                            <Text type="danger">{moment(product.shop.dateCreate).fromNow()}</Text>
                        </Card>
                    </Col>
                </Row>

            ) : (
                <Skeleton active />
            )
        }

    </>)

}

export default ShopInfomations;