import { apiGetAuth, apiPostAuth } from '../defaultApi';

export const getCouponPublic = (shopId) => {
    return apiGetAuth(`api/Coupons/GetCouponPublic?shopId=${shopId}`);
};

export const getCouponPrivate = (couponCode, shopId) => {
    return apiGetAuth(`api/Coupons/GetCouponPrivate?couponCode=${couponCode}&shopId=${shopId}`);
};
export const getCouponSellerById = (userId, couponId) => {
    return apiGetAuth(`api/Coupons/${userId}/${couponId}`);
};
export const checkCouponCodeExist = async (action, couponCode) => {
    return await apiGetAuth(`api/Coupons/IsExistCouponCode/${action}/${couponCode}`);
};
export const getCouponsSeller = (data) => {
    return apiPostAuth('api/Coupons/Seller/List', data);
};
export const addCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Add', data);
};
export const editCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Edit', data);
};

export const updateStatusCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Edit/Status', data);
};
export const updateCouponFinish = (couponId) => {
    return apiPostAuth(`api/Coupons/Edit/Finish/${couponId}`);
};
export const removeCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Remove', data);
};