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
        <Spin style={{ top: "20%" }} tip="... Đang tải" size="large" spinning={props.spinning} indicator={antIcon}>
            {props.children}
        </Spin>
    );
}

export default Spinning;