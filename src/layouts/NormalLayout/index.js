import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { Layout } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterCircleFilled } from '@ant-design/icons';

import HeaderLayout from '~/layouts/HeaderLayout';

import classNames from 'classnames/bind';
import styles from './NormalLayout.module.scss';

const cx = classNames.bind(styles);

const { Content, Footer } = Layout;

function NormalLayout(props) {

    const location = useLocation();
    const isDepositPage = location.pathname === '/deposit';

    useEffect(() => {
        window.scrollTo(0, 0)
    })

    return (
        <>
            <Layout className={cx("layout")}>
                <HeaderLayout />
                <Content>
                    <div
                        style={{
                            background: isDepositPage ? '#343541' : '#f4f7fe',
                            paddingRight: 30,
                            paddingLeft: 30,
                            paddingTop: isDepositPage ? 0 : 30,
                            paddingBottom: isDepositPage ? 0 : 30,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

                <Footer className={cx("footer")}>
                    <div className={cx("footer-top")}>
                        <div className={cx("footer-links")}>
                            <h2>Liên Hệ</h2><br />
                            <ul>
                                <li>Điện thoại: 012 345 6789</li>
                                <li>Email: digitalfuhub@gmail.com</li>
                            </ul>
                        </div>

                        <div className={cx("footer-links")}>
                            <h2>Mạng Xã Hội</h2><br />
                            <ul>
                                <li><FacebookOutlined /> <a href="https://www.facebook.com/react" target="_blank" rel="noreferrer">Facebook</a></li>
                                <li><InstagramOutlined /> <a href="https://www.instagram.com/reactjs1/" target="_blank" rel="noreferrer">Instagram</a></li>
                                <li><TwitterCircleFilled /> <a href="https://twitter.com/reactjs" target="_blank" rel="noreferrer">Twitter</a></li>
                            </ul>
                        </div>

                        <div className={cx("footer-links")} style={{ borderRight: '1px solid black' }}>
                            <h2>Chính Sách</h2><br />
                            <ul>
                                <li><Link to="/privacyPolicy">Chính sách bảo mật</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                                <li><Link to="/warrantPolicy">Chính sách bảo hành & đổi trả</Link></li>
                            </ul>
                        </div>
                    </div>
                </Footer>
            </Layout >
        </>
    );
}

export default NormalLayout;