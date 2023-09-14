import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

import { Divider, Modal, Input, Row, Space, Col } from "antd";


function Deposite() {
    const auth = useAuthUser();
    const user = auth();
    const navigate = useNavigate();

    const [qrCode, setQrCode] = useState("https://img.vietqr.io/image/970415-113366668888-compact.png")

    useEffect(() => {
        if (user === null) {
            return navigate("/login")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <>
            <Row>
                <h1>Nạp tiền</h1>
            </Row>

            <div style={{ height: 'auto', width: "90%", margin: "0 auto", borderStyle: "solid", borderRadius: "10px" }}>
                <Row>
                    <Col xs={24} xl={8} offset={1}>
                        One of three columns
                    </Col>

                    <Col xs={24} xl={13} offset={1}>
                        One of three columns
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Deposite; 