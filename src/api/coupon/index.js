import { apiGet } from '../defaultApi';

export const getCoupons = (shopId) => {
    return apiGet(`api/Coupons/getByShopId/${shopId}`);
};