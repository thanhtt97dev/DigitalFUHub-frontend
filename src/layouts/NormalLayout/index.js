import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { Layout, theme } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterCircleFilled } from '@ant-design/icons';

import HeaderLayout from '~/layouts/HeaderLayout';

import classNames from 'classnames/bind';
import styles from './NormalLayout.module.scss';

const cx = classNames.bind(styles);

const { Content, Footer } = Layout;

function NormalLayout(props) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            {/* <Layout className={cx("layout")}>
                <HeaderLayout />
                <Content>
                    <div
                        style={{
                            background: colorBgContainer,
<<<<<<< HEAD
                            minHeight: "680px"
=======
                            width: '85%',
                            margin: '0 auto',
                            padding: 30,
                            minHeight: '90vh'
>>>>>>> ac97433cf751b5d2db8626d8ca5bb9f2ccc36b6d
                        }}

                    >
                        <Outlet />
                    </div>
                </Content> */}

            {/* <Footer className={cx("footer")}>
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
                                <li><FacebookOutlined /> <a href="https://www.facebook.com/react">Facebook</a></li>
                                <li><InstagramOutlined /> <a href="https://www.instagram.com/reactjs1/">Instagram</a></li>
                                <li><TwitterCircleFilled /> <a href="https://twitter.com/reactjs">Twitter</a></li>
                            </ul>
                        </div>

                        <div className={cx("footer-links")} style={{ borderRight: '1px solid black' }}>
                            <h2>Chính Sách</h2><br />
                            <ul>
                                <li><a href="/privacyPolicy">Chính sách bảo mật</a></li>
                                <li><a href="/faq">FAQ</a></li>
                                <li><a href="/warrantPolicy">Chính sách bảo hành & đổi trả</a></li>
                            </ul>
                        </div>
                    </div>
                </Footer> 
            </Layout >*/}

            <div className={cx('page')}>
                <HeaderLayout className={cx('header')} />
                <Content className={cx('content')}>
                    <div style={{
                        background: colorBgContainer,
                        width: '85%',
                        margin: '0 auto'
                    }}>
                        <Outlet />
                    </div>
                </Content>
                <div className="footer">Footer</div>
            </div>
        </>
    );
}

export default NormalLayout;