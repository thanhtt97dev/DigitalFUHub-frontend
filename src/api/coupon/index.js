import { apiGet } from '../defaultApi';

export const getCoupons = (shopId, couponCode) => {
    return apiGet(`api/Coupons/getCoupons?shopId=${shopId}&couponCode=${couponCode}`);
};