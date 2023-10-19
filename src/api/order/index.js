import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/AddOrder`, data);
};
export const getAllOrdersCustomer = (data) => {
    return apiPostAuth(`api/Orders/All/Customer`, data);
};
export const getOrderDetailCustomer = (userId, orderId) => {
    return apiGetAuth(`api/Orders/Customer/${userId}/${orderId}`);
};
export const customerUpdateStatusOrder = (data) => {
    return apiPostAuth(`api/Orders/Edit/Status`, data);
};
export const getOrdersSeller = (data) => {
    return apiPostAuth('api/Orders/All/Seller', data);
};
export const getOrderDetailSeller = (orderId) => {
    return apiGetAuth(`api/Orders/${orderId}/Seller`);
};