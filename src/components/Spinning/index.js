import React from "react";
import { Spin } from "antd";


function Spinning(props) {
    return (
        <Spin style={{ top: "20%" }} tip="... Đang tải" size="large" spinning={props.spinning}>
            {props.children}
        </Spin>
    );
}

export default Spinning;