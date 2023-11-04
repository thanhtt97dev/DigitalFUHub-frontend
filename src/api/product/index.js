import { apiGet, apiGetAuth, apiPostAuthForm } from '../defaultApi';

export const getProductById = (id) => {
    return apiGet(`api/Products/GetById/${id}`);
};

export const getAllProducts = () => {
    return apiGet(`api/Products/GetAllProduct`);
};

export const getAllProductsSeller = (userId) => {
    return apiGetAuth(`api/Products/Seller/${userId}/All`);
};
export const getListProductOfSeller = (productId, productName, page) => {
    return apiGetAuth(`api/Products/Seller/List?productId=${productId}&productName=${productName}&page=${page}`);
};
export const getProductSellerById = (userId, productId) => {
    return apiGetAuth(`api/Products/Seller/${userId}/${productId}`);
};
export const addProductSeller = (formData) => {
    return apiPostAuthForm('api/Products/Add', formData);
};
export const editProductSeller = (formData) => {
    return apiPostAuthForm('api/Products/Edit', formData);
};