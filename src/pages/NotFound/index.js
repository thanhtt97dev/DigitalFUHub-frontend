import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    /// router
    const navigate = useNavigate();
    ///

    /// handles
    const handleNavigateToHomePage = () => {
        navigate('/home');
    }
    ///
    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, trang bạn truy cập không tồn tại"
            extra={<Button type="primary" onClick={handleNavigateToHomePage}>Quay lại trang chủ</Button>}
        />
    );
}

export default NotFound;
