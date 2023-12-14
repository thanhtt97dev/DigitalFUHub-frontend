import { apiGet, apiGetAuth } from '../defaultApi';

export const getAllCategory = () => {
    return apiGet('api/Categories/GetAll');
};
export const getAllCategoryForSeller = () => {
    return apiGetAuth('api/Categories/Seller/All');
};