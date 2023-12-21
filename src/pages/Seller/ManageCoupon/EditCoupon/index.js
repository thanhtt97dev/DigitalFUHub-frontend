/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Card, Space, Spin, Typography, Modal } from "antd";
import { getUserId } from "~/utils";
import { COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, COUPON_TYPE_SPECIFIC_PRODUCTS, RESPONSE_CODE_SHOP_BANNED, RESPONSE_CODE_SUCCESS } from "~/constants";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { editCouponSeller, getCouponSellerById } from "~/api/coupon";
import { EditCouponForProduct, EditCouponForShop } from "~/components/Seller/Coupon";
import { ExclamationCircleFilled, LeftOutlined } from "@ant-design/icons";
const { Link } = Typography;
const { confirm } = Modal;
function EditCoupon() {
    const navigate = useNavigate();
    const notification = useContext(NotificationContext);
    const { couponId } = useParams();
    const [coupon, setCoupon] = useState();
    useEffect(() => {
        getCouponSellerById(getUserId(), couponId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setCoupon(res.data.result);
                } else {
                    notification("error", "Vui lòng kiểm tra lại.");
                    return navigate("/seller/coupon/list")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.");
                return navigate("/seller/coupon/list")
            })
    }, [])
    const onEditCoupon = ({ couponCode, couponName, startDate, endDate, priceDiscount, minTotalOrderValue,
        isPublic, quantity, typeId, productsApplied }) => {
        const data = {
            userId: getUserId(),
            couponId,
            couponCode,
            couponName,
            startDate,
            endDate,
            priceDiscount,
            minTotalOrderValue,
            isPublic,
            quantity,
            typeId,
            productsApplied
        }

        editCouponSeller(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Cập nhật mã giảm giá thành công")
                    return navigate("/seller/coupon/list")
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                } else {
                    notification("error", "Vui lòng kiểm tra lại dữ liệu")
                }
            }).catch((err) => {
                notification("error", "Đã có lỗi xảy ra")
            })
    }
    const handleBackPage = () => {
        confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleFilled />,
            content: 'Hủy thay đổi?',
            onOk() {
                return navigate('/seller/coupon/list');
            },
            onCancel() {
            },
        });
    }
    return (<Card title={
        <Space>
            <Link style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1em' }} onClick={handleBackPage} ><LeftOutlined /> <span style={{ fontWeight: '600', fontSize: '16px' }}>Trở lại</span></Link>
            <div>Cập nhật mã giảm giá</div>
        </Space>
    }>
        {!coupon ?
            <Spin spinning={true}></Spin>
            :
            (() => {
                if (coupon.couponTypeId === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP) {
                    return <EditCouponForShop coupon={coupon} onEditCoupon={onEditCoupon} />;
                } else if (coupon.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS) {
                    return <EditCouponForProduct coupon={coupon} onEditCoupon={onEditCoupon} />;
                } else {
                    return null;
                }
            })()
        }
    </Card>)
}

export default EditCoupon;