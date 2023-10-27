import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/Customer/AddOrder`, data);
};
export const getListOrdersCustomer = (data) => {
    return apiPostAuth(`api/Orders/Customer/List`, data);
};
export const getOrderDetailCustomer = (userId, orderId) => {
    return apiGetAuth(`api/Orders/Customer/${userId}/${orderId}`);
};
export const customerUpdateStatusOrder = (data) => {
    return apiPostAuth(`api/Orders/Customer/Edit/Status`, data);
};
export const getOrdersSeller = (data) => {
    return apiPostAuth('api/Orders/Seller/All', data);
};
export const getOrderDetailSeller = (userId, orderId) => {
    return apiGetAuth(`api/Orders/Seller/${userId}/${orderId}`);
};