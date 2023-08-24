import React, { useEffect } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';

function Notification({ hidden }) {
    const [api, contextHolder] = notification.useNotification();
    console.log(hidden);

    const openMessage = () => {
        api.open({
            message: 'Notification Title',
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
        });
    };

    useEffect(() => {
        if (!hidden) {
            openMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api]);

    return <>{contextHolder}</>;
}

export default Notification;
