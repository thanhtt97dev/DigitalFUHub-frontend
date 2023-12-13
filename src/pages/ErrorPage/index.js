import React from 'react';
import { Result } from 'antd';

function ErrorPage() {

    return (
        <Result
            status="500"
            title="500"
            subTitle="Xin lỗi, có lỗi xảy ra."
        />
    );
}

export default ErrorPage;
