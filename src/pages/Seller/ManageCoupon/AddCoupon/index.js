/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addCouponSeller } from "~/api/coupon";
import { Card, Space, Typography, Modal } from "antd";
import { COUPON_TYPE_SPECIFIC_PRODUCTS, COUPON_TYPE_ALL_PRODUCTS_OF_SHOP, RESPONSE_CODE_SUCCESS, RESPONSE_CODE_SHOP_BANNED } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { getUserId } from "~/utils";
import { AddCouponForShop, AddCouponForProduct } from "~/components/Seller/Coupon";
import { ExclamationCircleFilled, LeftOutlined } from "@ant-design/icons";
const { Link } = Typography;
const { confirm } = Modal;
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
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
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
        setLoading(true);
        addCouponSeller(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Tạo mã giảm giá thành công.")
                    return navigate('/seller/coupon/list');
                } else if (res.data.status.responseCode === RESPONSE_CODE_SHOP_BANNED) {
                    notification("error", "Cửa hàng của bạn đã bị khóa.")
                }
                else {
                    notification("error", "Tạo mã giảm giá thất bại.")
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                setLoading(false);
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


    return (<Card
        title={
            <Space>
                <Link style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1em' }} onClick={handleBackPage} ><LeftOutlined /> <span style={{ fontWeight: '600', fontSize: '16px' }}>Trở lại</span></Link>
                <div>Thêm mã giảm giá</div>
            </Space>
        }
    >
        {(() => {
            if (searchParams.get("case") === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP + '') {
                return <AddCouponForShop loading={loading} onAddCoupon={onAddCoupon} />;
            } else if (searchParams.get("case") === COUPON_TYPE_SPECIFIC_PRODUCTS + '') {
                return <AddCouponForProduct loading={loading} onAddCoupon={onAddCoupon} />;
            } else {
                return null
            }
        })()
        }
    </Card>);
}

export default AddCoupon;