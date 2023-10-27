import { apiGet, apiGetAuth, apiPostAuthForm } from '../defaultApi';

export const getProductById = (id) => {
    return apiGet(`api/Products/GetById/${id}`);
};

export const getAllProducts = () => {
    return apiGet(`api/Products/GetAllProduct`);
};

export const getAllProductsSeller = () => {
    return apiGetAuth(`api/Products/Seller/All`);
};

export const getProductSellerById = (userId, productId) => {
    return apiGetAuth(`api/Products/Seller/${productId}`);
};

export const addProductSeller = (formData) => {
    return apiPostAuthForm('api/Products/Add', formData);
};
export const editProductSeller = (formData) => {
    return apiPostAuthForm('api/Products/Edit', formData);
};