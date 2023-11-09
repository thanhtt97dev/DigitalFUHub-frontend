import React from 'react';
import { Button } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

const uploadButton = (
    <Button type="primary" shape="circle" icon={<FileImageOutlined />} size={30} />
);

export default uploadButton;