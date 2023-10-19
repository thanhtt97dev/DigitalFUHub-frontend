import { apiGet, apiPostAuth } from '../defaultApi';

export const getCoupons = (shopId, couponCode) => {
    return apiGet(`api/Coupons/getCoupons?shopId=${shopId}&couponCode=${couponCode}`);
};

export const checkCouponCodeExist = async (couponCode) => {
    return await apiGet(`api/Coupons/CheckCouponCodeExist/${couponCode}`);
};
export const getCouponsSeller = (data) => {
    return apiPostAuth('api/Coupons/List/Seller', data);
};
export const addCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Add', data);
};

export const updateStatusCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Edit/Status', data);
};

export const removeCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Remove', data);
};