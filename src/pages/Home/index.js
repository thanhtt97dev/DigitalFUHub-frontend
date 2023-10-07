import React, { useEffect, useState } from 'react';

import { Button, Table } from 'antd';
import { AlignLeftOutlined } from '@ant-design/icons';

import { useAuthUser } from 'react-auth-kit'
import { getAllProducts } from "~/api/product";

import autodeck from '~/assets/images/home/AutoDesk.png';
import gmail from '~/assets/images/home/gmail.png';
import gpt from '~/assets/images/home/GPT.png';
import microsoft from '~/assets/images/home/Microsoft Office.png';
import spotify from '~/assets/images/home/Spotify.png';
import steam from '~/assets/images/home/Steam.png';
import vpn from '~/assets/images/home/VPN.png';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Home() {
    const auth = useAuthUser()
    const user = auth();

    const [dataTable, setDataTable] = useState([]);

    const [visibleProducts, setVisibleProducts] = useState(8);

    useEffect(() => {
        getAllProducts(user.id)
            .then((res) => {
                setDataTable(res.data);
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <div className={cx("header")}>
                <div className={cx("grid1-container")}>
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
                        <Link to="/product/1">
                            <img src={autodeck} alt='img' />
                        </Link>
                    </div>
                    <div>
                        <Link to="/product/1">
                            <img src={vpn} alt='img' />
                        </Link>
                    </div>
                    <div>
                        <Link to="/product/1">
                            <img src={spotify} alt='img' />
                        </Link>
                    </div>
                </div>
                <div className={cx("grid1-container")}>
                    <div>
                        <Link to="/product/1">
                            <img src={microsoft} alt='img' />
                        </Link>
                    </div>
                    <div>
                        <aLink to="/product/1">
                            <img src={gpt} alt='img' />
                        </aLink>
                    </div>
                    <div>
                        <Link to="/product/1">
                            <img src={steam} alt='img' />
                        </Link>
                    </div>
                    <div>
                        <Link to="/product/1">
                            <img src={gmail} alt='img' />
                        </Link>
                    </div>
                </div>
            </div>

            <div className={cx("body")}>
                <h2>Từ Khóa Nổi Bật</h2>
                <div className={cx("grid2-container1")}>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#3D5A80' }}>Làm việc</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#98C1D8' }}>Giải trí</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#EE6C4D' }}>Học Tập</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#293241' }}>Spotify</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#545B67' }}>Wallet</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item1")} style={{ backgroundColor: '#767C85' }}>Youtube</div>
                    </a>
                </div>

                <h2>Sản phẩm nổi bật</h2>
                <p>Danh sách những sản phẩm theo xu hướng mà có thể bạn sẽ thích</p><br />
                <div className={cx("grid2-container2")}>
                    {dataTable.slice(0, visibleProducts).map((item) => (
                        <div key={item.productId}>
                            <div>
                                <Link className={cx("grid2-item2")} to={`/product/${item.productId}`}>
                                    <img src={item.thumbnail} /><br />
                                </Link>
                                <Link className={cx("grid2-item2")} to={`/product/${item.productId}`}>
                                    <span className={cx("name")}>{item.productName}</span>
                                </Link>
                                <div className={cx("grid2-item2")}>
                                    {item.productVariants.map((variant, index) => (
                                        <div key={index}>
                                            <p>
                                                <span>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(variant.price - (variant.price * (item.discount / 100)))}
                                                </span>
                                                &nbsp;
                                                &nbsp;
                                                <del>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(variant.price)}
                                                </del>
                                                &nbsp;
                                                &nbsp;
                                                <span className={cx("discount")}>-{item.discount}%</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {visibleProducts < dataTable.length && (
                    <>
                        <div className="border-top"></div>
                        <div className={cx("load-more-button")}>
                            <a onClick={() => setVisibleProducts(visibleProducts + 8)}>Xem thêm</a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Home;