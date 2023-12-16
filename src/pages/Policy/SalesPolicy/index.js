

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './SalesPolicy.module.scss';

import { getFee } from '~/api/shopRegisterFee'
import { formatPrice } from '~/utils';
import { Card } from 'antd';
import Spinning from '~/components/Spinning';

const cx = classNames.bind(styles);
function SalesPolicy() {

    const [fee, setFee] = useState(-1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getFee()
            .then((res) => {
                setFee(res.data.result)
                setTimeout(() => {
                    setLoading(false)
                }, 600)
            }).catch(() => {

            })
    }, [])

    return (
        <Spinning spinning={loading}>
            <div className={cx("sales-policy")}>
                <Card
                    style={{
                        width: "900px",
                        margin: "0 auto",
                    }}
                >
                    <h1>CHÍNH SÁCH ĐĂNG KÝ BÁN HÀNG</h1><br />
                    <p>- Đảm bảo rằng bạn tuân thủ tất cả các quy định và luật lệ liên quan đến doanh nghiệp trực tuyến.</p><br />
                    <p>- Nghiêm cấm bán các mặt hàng lừa đảo, vi phạm đến pháp luật, mọi hành vi của bạn sẽ phải tự chịu tránh nhiệm với pháp luật.</p><br />
                    <p>- Bảo vệ thông tin khách hàng và thông tin doanh nghiệp theo quy định và chính sách bảo mật.</p><br />
                    <p>- Thiết lập chính sách chăm sóc khách hàng để giải quyết mọi thắc mắc và khiếu nại.</p><br />
                    <p>- Cung cấp thông tin liên hệ dễ tiếp cận.</p><br />
                    <p>- Mỗi đơn hàng của bạn sẽ bị chiết khấu để phục vụ duy trì hệ thống.</p><br />
                    <p>- Phí để đăng ký trở thành người bán hàng tại DigitalFuHub là <b style={{ fontSize: "20px", color: "red" }}>{formatPrice(fee)}</b> . Khoản phí này sẽ tự động trừ vào số dư của bạn!</p><br />
                    <h4>Mọi câu hỏi hoặc yêu cầu hỗ trợ khác, xin vui lòng liên hệ với chúng tôi. Chúng tôi rất vui lòng được phục vụ bạn!</h4><br />
                </Card
                >
            </div>
        </Spinning>
    );
} export default SalesPolicy;