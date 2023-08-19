import React from 'react';
import { Col, Divider, Row } from 'antd';
import { Link } from 'react-router-dom';

import Logout from '~/components/Logout';

function Home() {
    return (
        <React.Fragment>
            <Divider orientation="left">sub-element align left</Divider>
            <Row justify="start">
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
            </Row>
            <Link to="/Dashboard">Dashboard</Link>
            <Logout />
        </React.Fragment>
    );
}

export default Home;
