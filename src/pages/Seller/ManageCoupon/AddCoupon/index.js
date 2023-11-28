/* eslint-disable react-hooks/exhaustive-deps */

import { Card } from "antd";

import { useContext, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addCouponSeller } from "~/api/coupon";
import { COUPON_TYPE_SPECIFIC_PRODUCTS, COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { getUserId } from "~/utils";
import { AddCouponForShop, AddCouponForProduct } from "~/components/Seller/Coupon";
// import NotFound from "~/pages/NotFound";

// const { RangePicker } = DatePicker;
// const range = (start, end) => {
//     const result = [];
//     for (let i = start; i < end; i++) {
//         result.push(i);
//     }
//     return result;
// };

const removeSecondOfDateTime = (date) => date.slice(0, date.length - 6) + ' ' + date.slice(-2)

function AddCoupon() {
    const notification = useContext(NotificationContext)
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useLayoutEffect(() => {
        console.log(searchParams.get("case"))
        if (searchParams.get("case") !== COUPON_TYPE_ALL_PRODUCTS_OF_SHOP + '' && searchParams.get("case") !== COUPON_TYPE_SPECIFIC_PRODUCTS + '') {
            return navigate("/notfound");
        }
    }, [])
    const onAddCoupon = (values) => {
        const data = {
            userId: getUserId(),
            couponName: values.couponName,
            couponCode: values.couponCode,
            priceDiscount: values.priceDiscount,
            MinTotalOrderValue: values.minTotalOrderValue,
            startDate: removeSecondOfDateTime(values.startDate.$d.toLocaleString()),
            endDate: removeSecondOfDateTime(values.endDate.$d.toLocaleString()),
            quantity: values.quantity,
            isPublic: values.isPublic,
            typeId: values.typeId
        }
        if (values.typeId === COUPON_TYPE_SPECIFIC_PRODUCTS) {
            data.productsApplied = values.productsApplied
        }
        addCouponSeller(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Tạo mã giảm giá thành công.")
                    return navigate('/seller/coupon/list');
                } else {
                    notification("error", "Tạo mã giảm giá thất bại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
    }


    return (<Card title="Thêm mã giảm giá">
        {(() => {
            if (searchParams.get("case") === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP + '') {
                return <AddCouponForShop onAddCoupon={onAddCoupon} />;
            } else if (searchParams.get("case") === COUPON_TYPE_SPECIFIC_PRODUCTS + '') {
                return <AddCouponForProduct onAddCoupon={onAddCoupon} />;
            } else {
                return null
            }
        })()
        }
    </Card>);
}

export default AddCoupon;