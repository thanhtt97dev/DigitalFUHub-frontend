import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const addProductToCart = (data) => {
    return apiPostAuth(`api/Carts/addProductToCart`, data);
};

export const getCart = (userId, productVariantId) => {
    return apiGetAuth(`api/Carts/GetCart?userId=${userId}&productVariantId=${productVariantId}`);
};