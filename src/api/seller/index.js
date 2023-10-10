import { apiGetAuth, apiPostAuthForm, apiPostAuth, apiPutAuthForm } from '../defaultApi';

export const getAllProducts = (id) => {
    return apiGetAuth(`api/sellers/GetAllProduct/${id}`);
};

export const getProductById = (userId, productId) => {
    return apiGetAuth(`api/sellers/${userId}/Product/${productId}`);
};

export const addProduct = (formData) => {
    return apiPostAuthForm('api/Sellers/Product/New', formData);
};
export const editProduct = (productId, formData) => {
    return apiPutAuthForm(`api/Sellers/Product/Edit/${productId}`, formData);
};
export const registerSeller = (data) => {
    return apiPostAuth('api/Sellers/Register', data);
}
export const getSellerOrders = (data) => {
    return apiPostAuth('api/Sellers/Orders', data);
};
export const getOrderDetail = (orderId) => {
    return apiGetAuth(`api/Sellers/Orders/${orderId}`);
}