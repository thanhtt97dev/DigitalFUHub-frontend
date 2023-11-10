import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';


const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

function Spinning(props) {
    return (
        <Spin {...props} style={{ minHeight: "100vh" }} tip="... Đang tải" size="large" indicator={antIcon}>
            {props.children}
        </Spin>
    );
}

export default Spinning;