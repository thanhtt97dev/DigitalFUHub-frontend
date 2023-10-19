import { apiGet, apiGetAuth, apiPostAuthForm, apiPutAuthForm } from '../defaultApi';

export const getProductById = (id) => {
    return apiGet(`api/Products/GetById/${id}`);
};

export const getAllProducts = () => {
    return apiGet(`api/Products/GetAllProduct`);
};

export const getAllProductsSeller = (id) => {
    return apiGetAuth(`api/Products/All/Seller/${id}`);
};

export const getProductSellerById = (userId, productId) => {
    return apiGetAuth(`api/Products/${productId}/Seller/${userId}`);
};

export const addProductSeller = (formData) => {
    return apiPostAuthForm('api/Products/Add', formData);
};
export const editProductSeller = (productId, formData) => {
    return apiPutAuthForm(`api/Products/Edit/${productId}`, formData);
};