import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

import { Row, Col } from "antd";


const vietQr = process.env.REACT_APP_BANK_ACCOUNT_IMAGE_SRC;

function Deposit() {
    const auth = useAuthUser();
    const user = auth();
    const navigate = useNavigate();

    const location = useLocation();

    const [code, setCode] = useState("")
    const [amount, setAmount] = useState("")
    const [qrCode, setQrCode] = useState()

    useEffect(() => {
        if (location.state === null) {
            alert("Xảy ra sự cố! Hãy thử lại sau!")
            return navigate("/home");
        }
        setCode(location.state.code)
        setAmount(location.state.amount)
        setQrCode(vietQr + `&amount=${location.state.amount}&addInfo=${location.state.code}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <>
            <Row>
                <h1>Nạp tiền</h1>
            </Row>

            <div style={{ height: 'auto', width: "30%", margin: "0 auto" }}>
                <div id="qrCode">
                    <img src={qrCode} alt="payment" style={{ display: "block", margin: "0 auto", width: "90%" }} />
                </div>
                <ul style={{ display: "block", margin: "0 auto", width: "100%", marginLeft: "20%" }}>
                    <li>Số tiền: <b><span style={{ color: "red" }}>{amount} VNĐ</span></b> </li>
                    <li>Nội dung chuyển khoản: <b><span style={{ color: "red" }}>{code}</span></b> </li>
                    <li>Tên chủ tài khoản: <b><span style={{ color: "red" }}>Lê Đức Hiếu</span></b> </li>
                    <li>Số tài khoản: <b><span style={{ color: "red" }}>0336687454</span></b></li>
                    <li><b><span style={{ color: "red" }}>Ngân hàng Quân đội </span></b></li>
                </ul>

                <h3 style={{ color: "red" }}>Chú ý mỗi mã QRCode chỉ chuyển 1 lần duy nhất</h3>
                <p>
                    Nếu chuyển thủ công điền sai thông tin chuyển khoản hoặc chuyển nhiều lần cùng 1 mã giao dịch, hệ thống sẽ
                </p>
                <ul>
                    <li><strong>không</strong> cộng tiền vào tài khoản của quý khách</li>
                    <li><strong>không</strong> hoàn trả tiền</li>
                    <li><strong>không</strong> chịu trách nhiệm về khoản tiền chuyển nhầm hoặc chuyển thừa</li>
                </ul>
                <h4>
                    Vui lòng chờ đợi 1 vài phút để hệ thống cập nhật số dư sau khi đã chuyển khoản.<br />
                </h4>
            </div>

            <Row>
                <Col xs={24} xl={8} offset={1}>
                </Col>

                <Col xs={24} xl={13} offset={1}>
                </Col>
            </Row>
        </>
    );
}

export default Deposit; 