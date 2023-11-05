/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Card, Spin, } from "antd";
import { getUserId } from "~/utils";
import { COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, COUPON_TYPE_SPECIFIC_PRODUCTS, RESPONSE_CODE_SUCCESS } from "~/constants";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { editCouponSeller, getCouponSellerById } from "~/api/coupon";
import { EditCouponForProduct, EditCouponForShop } from "~/components/Seller/Coupon";

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
                    return navigate("/seller/coupon/list")
                }
            })
            .catch((err) => {
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
                } else {
                    notification("error", "Vui lòng kiểm tra lại dữ liệu")
                }
            }).catch((err) => {
                notification("error", "Đã có lỗi xảy ra")
            })
    }

    return (<Card title="Cập nhật mã giảm giá">
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