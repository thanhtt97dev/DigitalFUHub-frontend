import { apiGetAuth, apiPostAuthForm } from '../defaultApi';

export const getAllProducts = (id) => {
    return apiGetAuth(`api/sellers/GetAllProduct/${id}`);
};

export const getProductVariants = (id) => {
    return apiGetAuth(`api/sellers/GetProductVariants/${id}`);
};

export const addProduct = (formData) => {
    return apiPostAuthForm('api/Sellers/Product/New', formData);
};