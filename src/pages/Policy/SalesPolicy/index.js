
import classNames from 'classnames/bind';
import styles from './SalesPolicy.module.scss';
const cx = classNames.bind(styles);
function SalesPolicy() {
    return (
        <>
            <div className={cx("sales-policy")}>
                <h1>CHÍNH SÁCH ĐĂNG KÝ BÁN HÀNG</h1><br />
                <p>- Đảm bảo rằng bạn tuân thủ tất cả các quy định và luật lệ liên quan đến doanh nghiệp trực tuyến.</p><br />
                <p>- Nghiêm cấm bán các mặt hàng lừa đảo, vi phạm đến pháp luật, mọi hành vi của bạn sẽ phải tự chịu tránh nhiệm với pháp luật.</p><br />
                <p>- Bảo vệ thông tin khách hàng và thông tin doanh nghiệp theo quy định và chính sách bảo mật.</p><br />
                <p>- Thiết lập chính sách chăm sóc khách hàng để giải quyết mọi thắc mắc và khiếu nại.</p><br />
                <p>- Cung cấp thông tin liên hệ dễ tiếp cận.</p><br />
                <p>- Mỗi đơn hàng của bạn sẽ bị chiết khấu để phục vụ duy trì hệ thống.</p><br />
                <h4>Mọi câu hỏi hoặc yêu cầu hỗ trợ khác, xin vui lòng liên hệ với chúng tôi. Chúng tôi rất vui lòng được phục vụ bạn!</h4><br />
            </div>
        </>
    );
}

export default SalesPolicy;