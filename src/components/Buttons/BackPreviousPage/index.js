import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
    RollbackOutlined
} from '@ant-design/icons';

function BackPreviousPage({ url, state }) {

    const navigate = useNavigate();
    const handleClick = () => {
        return navigate(url, { state: state })
    }

    return (
        <Button size="large" onClick={handleClick}>
            <RollbackOutlined /> Trở lại
        </Button>
    );

}

export default BackPreviousPage;