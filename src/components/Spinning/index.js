import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";


import classNames from 'classnames/bind';
import styles from './Spinning.module.scss';
const cx = classNames.bind(styles)

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 30,
        }}
        spin
    />
);

function Spinning() {
    return (
        <div className={cx("spinning-page")}>
            <Spin indicator={antIcon} className={cx("spin")} />
        </div>
    );
}

export default Spinning;