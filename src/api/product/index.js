import { apiGet } from '../defaultApi';

export const getProductById = (id) => {
    return apiGet(`api/Products/GetById/${id}`);
};

export const getAllProducts = () => {
    return apiGet(`api/Products/GetAllProduct`);
};