import { apiGetAuth, apiPostAuthForm, apiPostAuth } from '../defaultApi';

export const getAllProducts = (id) => {
    return apiGetAuth(`api/sellers/GetAllProduct/${id}`);
};

export const getProductById = (userId, productId) => {
    return apiGetAuth(`api/sellers/${userId}/GetProduct/${productId}`);
};

export const addProduct = (formData) => {
    return apiPostAuthForm('api/Sellers/Product/New', formData);
};
export const registerSeller = (data) => {
    return apiPostAuth('api/Sellers/Register', data);
}