import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCouponDetailCustomerById } from "~/api/coupon";
import { RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_SUCCESS } from "~/constants";
import { Card, Space, Spin, Typography, Modal, Row, Button } from "antd";

const CouponDetailCustomer = () => {
    /// states
    const [coupon, setCoupon] = useState({});
    const navigate = useNavigate();
    const { couponId } = useParams();
    ///

    /// useEffects
    useEffect(() => {
        getCouponDetailCustomerById(couponId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setCoupon(data.result);
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        navigate('/notFound');
                    } else {
                        navigate('/errorPage');
                    }
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    ///


    return (<>
        {
            coupon ? (<Card style={{ width: '20%', height: '30%' }}>
                <Space direction="vertical">
                    <p>Hạn sử dụng mã</p>
                    <p>{coupon.startDate} - {coupon.endDate}</p>
                </Space>
                <Space direction="vertical">
                    <p>Ưu đãi</p>
                    <p>Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé!Giảm {coupon.priceDiscount} Đơn Tối Thiểu {coupon.minTotalOrderValue}</p>
                </Space>
                <Space direction="vertical">
                    <p>Áp dụng cho sản phẩm</p>
                    <p>Những sản phẩm bị hạn chế chạy khuyến mại theo quy định của Nhà nước sẽ không được hiển thị nếu nằm trong danh sách sản phẩm đã chọn</p>
                </Space>
                <Space direction="vertical">
                    <p>Xem chi tiết</p>
                    <p>
                        Giảm ngay {coupon.priceDiscount} cho đơn hàng từ {coupon.minTotalOrderValue}. Áp dụng đến {coupon.endDate}. Mã giảm giá phát hành bởi Người bán và sẽ không được hoàn lại với bất kỳ lý do nào.
                    </p>
                </Space>
                <Button type="primary" onClick={() => { window.close(); }}>Đồng ý</Button>
            </Card>) : (<></>)
        }
    </>)
}

export default CouponDetailCustomer;