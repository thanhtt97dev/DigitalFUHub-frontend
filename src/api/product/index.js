import { apiGet, apiGetAuth, apiPostAuthForm, apiPostAuth, apiPost } from '../defaultApi';

export const getProductById = (id) => {
    return apiGet(`api/Products/GetById/${id}`);
};
export const getProductForHomePageCustomer = (data) => {
    return apiPost(`api/Products/homepage`, data);
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

export const getProductsOfSeller = (data) => {
    return apiPostAuth('api/Products/getProducts', data);
};

export const getProductByUserId = (data) => {
    return apiPost(`api/Products/GetAll`, data);
};
export const getListProductSearch = (data) => {
    return apiPost(`api/Products/Search`, data);
};
export const getProductSpecificOfCoupon = (data) => {
    return apiPostAuth(`api/Products/GetProductSpecificOfCoupon`, data);
};
