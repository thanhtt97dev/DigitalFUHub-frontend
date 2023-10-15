import { apiGet } from '../defaultApi';

export const getCoupons = (shopId, couponCode) => {
    return apiGet(`api/Coupons/getCoupons?shopId=${shopId}&couponCode=${couponCode}`);
};

export const checkCouponCodeExist = async (couponCode) => {
    return await apiGet(`api/Coupons/CheckCouponCodeExist/${couponCode}`);
};