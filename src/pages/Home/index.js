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

const cx = classNames.bind(styles);

const rows = [
    {
        dataIndex: 'productId',
        render: (productId, record) => {
            return (
                <a to={`/product/${productId}`}>
                    <img src={gpt} />
                </a>
            )
        }
    },
    {
        dataIndex: 'productId',
        render: (productId, record) => {
            return (
                <a to={`/product/${productId}`}>
                    <span>{record.productName}</span>
                </a>
            )
        }
    },
    {
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.price}</p>
                    ))
                    }
                </>
            )
        }),
        width: '15%',
    }
];

function Home() {
    const auth = useAuthUser()
    const user = auth();

    const [dataTable, setDataTable] = useState([]);

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
                <div className={cx("grid-container-1")}>
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
                <div className={cx("grid-container-1")}>
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

            <div className={cx("body")}>
                <h2>Từ Khóa Nổi Bật</h2>
                <div className={cx("grid2-container")}>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#3D5A80' }}>Làm việc</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#98C1D8' }}>Giải trí</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#EE6C4D' }}>Học Tập</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#293241' }}>Spotify</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#545B67' }}>Wallet</div>
                    </a>
                    <a href="/home">
                        <div className={cx("grid2-item")} style={{ backgroundColor: '#767C85' }}>Youtube</div>
                    </a>
                </div>

                <h2>Sản phẩm nổi bật</h2>
                <p>Danh sách những sản phẩm theo xu hướng mà có thể bạn sẽ thích</p>
                <div className={cx("grid-container-2")}>
                    <Table className={cx("grid-item")} rows={rows} dataSource={dataTable} />
                </div>
                <div className={cx("smore")}>
                    <a >Xem thêm</a>
                </div>
            </div>
        </>
    );
}

export default Home;