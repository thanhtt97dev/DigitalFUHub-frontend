import React from "react";

import classNames from 'classnames/bind';
import styles from './FAQ.module.scss';

const cx = classNames.bind(styles);

function FAQ() {
    return (
        <>
            <div className={cx("faq")}>
                <h1>FAQ - CÂU HỎI THƯỜNG GẶP</h1><br />

                <h4>1. Trang web của chúng tôi bán những sản phẩm gì?</h4><br />

                <p>- Chúng tôi chuyên cung cấp các sản phẩm trực tuyến, bao gồm các tài khoản, dịch vụ trực tuyến cho đến các khóa học giảng dạy chuyên nghiệp ở nhiều lĩnh vực khác nhau và nhiều sản phẩm khác.</p><br />

                <h4>2. Làm thế nào để tôi đặt mua sản phẩm trên trang web này?</h4><br />

                <p>- Để đặt hàng, bạn chỉ cần thêm sản phẩm bạn muốn mua vào giỏ hàng và tiến hành thanh toán thông qua cổng thanh toán trực tuyến. Chúng tôi chỉ chấp nhận đơn đặt hàng trực tuyến và không có dịch vụ giao hàng offline.</p><br />

                <h4>3. Làm thế nào để tôi biết sản phẩm có đủ chất lượng?</h4><br />

                <p>- Chúng tôi chỉ cung cấp các sản phẩm từ các người uy tín và đảm bảo chất lượng. Bạn có thể xem thông tin về sản phẩm, đánh giá từ khách hàng khác, và hướng dẫn sử dụng để đảm bảo rằng bạn đang mua sản phẩm chất lượng.</p><br />

                <h4>4. Làm thế nào để tôi liên hệ với chúng tôi nếu có câu hỏi hoặc phản hồi?</h4><br />

                <p>- Để liên hệ với chúng tôi, bạn có thể sử dụng thông tin liên hệ trên trang web của chúng tôi hoặc gửi email đến địa chỉ email hỗ trợ của chúng tôi. Chúng tôi sẽ cố gắng trả lời trong thời gian sớm nhất để hỗ trợ bạn.</p><br />

                <h4>5. Chúng tôi có chấp nhận trả hàng và hoàn tiền không?</h4><br />

                <p>- Chúng tôi tuân theo chính sách trả hàng và hoàn tiền có chi tiết trên trang "Chính sách Trả hàng" của chúng tôi. Xin vui lòng xem chi tiết để biết thêm thông tin.</p><br />

                <h4>6. Chúng tôi có cung cấp dịch vụ bảo hành không?</h4><br />

                <p>- Chúng tôi cung cấp các sản phẩm mới và chính hãng từ các nhà sản xuất uy tín, và sản phẩm đã qua kiểm tra chất lượng. Tuy nhiên, thông tin về dịch vụ bảo hành cụ thể có thể thay đổi tùy từng sản phẩm. Xin vui lòng kiểm tra trang web của chúng tôi để biết thông tin bảo hành chi tiết cho sản phẩm bạn mua.</p><br />

                <h4>7. Chúng tôi có cung cấp dịch vụ tư vấn sản phẩm không?</h4><br />

                <p>- Hiện tại, chúng tôi không cung cấp dịch vụ tư vấn sản phẩm trực tiếp. Tuy nhiên, bạn có thể xem thông tin chi tiết và đánh giá sản phẩm trên trang web của chúng tôi để đưa ra quyết định mua hàng thông minh.</p><br />

                <h4>8. Chúng tôi có chính sách bảo mật dữ liệu cá nhân không?</h4><br />

                <p>- Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Xin vui lòng xem chi tiết về chính sách bảo mật của chúng tôi trên trang web để biết thêm thông tin về cách chúng tôi thu thập, lưu trữ và sử dụng thông tin cá nhân của bạn.</p><br />

                <h4>8. Chúng tôi có chương trình khuyến mãi hoặc giảm giá không?</h4><br />

                <p>- Chúng tôi thường xuyên có các chương trình khuyến mãi và giảm giá cho các sản phẩm. Để biết thông tin về các ưu đãi hiện tại, vui lòng truy cập trang web của chúng tôi hoặc đăng ký nhận thông báo qua email để cập nhật các chương trình khuyến mãi mới nhất.</p><br />

                <h4>Mọi câu hỏi hoặc yêu cầu hỗ trợ khác, xin vui lòng liên hệ với chúng tôi. Chúng tôi rất vui lòng được phục vụ bạn!</h4><br />
            </div>
        </>
    );
}

export default FAQ;