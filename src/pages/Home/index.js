import React from 'react';

import { Button } from 'antd';
import { AlignLeftOutlined } from '@ant-design/icons';

import autodeck from '~/assets/images/home/AutoDesk.png';
import gmail from '~/assets/images/home/gmail.png';
import gpt from '~/assets/images/home/GPT.png';
import microsoft from '~/assets/images/home/Microsoft Office.png';
import spotify from '~/assets/images/home/Spotify.png';
import steam from '~/assets/images/home/Steam.png';
import vpn from '~/assets/images/home/VPN.png';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    return (
        <>
            <div className={cx("header")}>
                <div className={cx("grid-container")}>
                    <div className={cx("grid1")}>
                        <li><div><AlignLeftOutlined /> Danh mục sản phẩm</div></li>
                        <li><Button type="text" block>Giải trí</Button></li>
                        <li><Button type="text" block>Làm việc</Button></li>
                        <li><Button type="text" block>Học tập</Button></li>
                        <li><Button type="text" block>Game Steam</Button></li>
                        <li><Button type="text" block>EA Games</Button></li>
                        <li><Button type="text" block>Windows, Office</Button></li>
                        <li><Button type="text" block>Google Drive</Button></li>
                        <li><Button type="text" block>Steam Wallet</Button></li>
                        <li><Button type="text" block>Gói Data Mobile</Button></li>
                        <li><Button type="text" block>Google Play, iTunes</Button></li>
                    </div>
                    <div className={cx("grid2")}>
                        <a href="/product/1">
                            <img src={autodeck} />
                        </a>
                    </div>
                    <div>
                        <a href="/product/1">
                            <img src={vpn} />
                        </a>
                    </div>
                    <div>
                        <a href="/product/1">
                            <img src={spotify} />
                        </a>
                    </div>
                </div>
                <div className={cx("grid-container")}>
                    <div>
                        <a href="/product/1">
                            <img src={microsoft} />
                        </a>
                    </div>
                    <div>
                        <a href="/product/1">
                            <img src={gpt} />
                        </a>
                    </div>
                    <div>
                        <a href="/product/1">
                            <img src={steam} />
                        </a>
                    </div>
                    <div>
                        <a href="/product/1">
                            <img src={gmail} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;