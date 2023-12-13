import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Deposit.module.scss';
import { BANK_ACCOUNT_IMAGE_SRC } from '~/constants'
import { formatPrice } from "~/utils";

const cx = classNames.bind(styles);

function Deposit() {
    const navigate = useNavigate();
    const location = useLocation();

    const [amount, setAmount] = useState(0);
    const [code, setCode] = useState("");
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        if (location.state === null) {
            alert("Xảy ra sự cố! Hãy thử lại sau!");
            return navigate("/home");
        }
        setAmount(location.state.amount)
        setCode(location.state.code);
        const bankCodeInfo = `&amount=${location.state.amount}&addInfo=${location.state.code}`;
        setQrCode(BANK_ACCOUNT_IMAGE_SRC + bankCodeInfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className={cx("instruction")}>
                <h2 className={cx("section-title")}>Chuyển khoản bằng QR</h2>
            </div>
            <div className={cx("deposit-container-1")}>
                <div className={cx("part")}>
                    <div className={cx("qr-code")}>
                        <img src={qrCode} alt="payment" />
                    </div>
                </div>
                <div className={cx("part")}>
                    <ul className={cx("qr-code-guide")}>
                        <li></li>
                        <li><strong>Bước 1:</strong> Mở app ngân hàng và quét mã QR.</li>
                        <li ><strong>Bước 2:</strong> Đảm bảo nội dung chuyển khoản là <b className={cx("code")}>{code}</b>.</li>
                        <li><strong>Bước 3:</strong> Thực hiện thanh toán.</li>
                    </ul>
                </div>
            </div >
            <div className={cx("deposit-container-2")}>
                <div className={cx("part")}>
                    <h2 className={cx("section-title")}>Chuyển khoảng thủ công</h2>
                    <div className={cx("info")}>
                        <ul className={cx("grid-container")}>
                            <li className={cx("grid-item")}>
                                <span className={cx("head-grid")}>Số tiền:</span> <br />
                                <b className={cx("code")}>{formatPrice(amount)}</b>
                            </li>
                            <li className={cx("grid-item")}>
                                <span className={cx("head-grid")}>Nội dung chuyển khoản:</span> <br />
                                <b className={cx("code")}>{code}</b>
                            </li>
                            <li className={cx("grid-item")}>
                                <span className={cx("head-grid")}>Tên chủ tài khoản:</span> <br />
                                <b>Lê Đức Hiếu</b>
                            </li>
                            <li className={cx("grid-item")}>
                                <span className={cx("head-grid")}>Số tài khoản:</span> <br />
                                <b>0336687454 - Ngân hàng Quân đội</b>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx("part")}>
                    <h2 className={cx("section-title")}>Lưu ý</h2>
                    <div className={cx("note-adj")}>
                        <h3>Chú ý mỗi mã QRCode chỉ chuyển 1 lần duy nhất.</h3>
                        <p>Nếu chuyển thủ công điền sai thông tin chuyển khoản hoặc chuyển nhiều lần cùng 1 mã giao dịch, hệ thống sẽ : </p>
                        <ul className={cx("note")}>
                            <li><strong>Không</strong> cộng tiền vào tài khoản của quý khách.</li>
                            <li><strong>Không</strong> hoàn trả tiền.</li>
                            <li><strong>Không</strong> chịu trách nhiệm về khoản tiền chuyển nhầm hoặc chuyển thừa.</li>
                        </ul>
                        <p>Vui lòng chờ đợi 1 vài phút để hệ thống cập nhật số dư sau khi đã chuyển khoản.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Deposit;