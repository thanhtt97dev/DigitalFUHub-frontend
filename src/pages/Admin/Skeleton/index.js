import React from 'react';
import { Col, Row, Skeleton, Space } from 'antd';

function SkeletonPage() {
    return (
        <>
            <Col offset={3} span={8}>
                <Skeleton.Input block active />
            </Col>
            <br />
            <Col offset={3} span={8}>
                <Skeleton.Input block active />
            </Col>
            <br />

            <Row>
                <Col offset={3} span={8}>
                    <Skeleton.Input block active />
                </Col>
                <Col offset={1}>
                    <Skeleton.Button active />
                </Col>
            </Row>
        </>
    );
}

export default SkeletonPage;
