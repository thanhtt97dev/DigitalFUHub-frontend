import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/Customer/AddOrder`, data);
};
export const getAllOrdersCustomer = (data) => {
    return apiPostAuth(`api/Orders/Customer/All`, data);
};
export const getOrderDetailCustomer = (orderId) => {
    return apiGetAuth(`api/Orders/Customer/${orderId}`);
};
export const customerUpdateStatusOrder = (data) => {
    return apiPostAuth(`api/Orders/Customer/Edit/Status`, data);
};
export const getOrdersSeller = (data) => {
    return apiPostAuth('api/Orders/Seller/All', data);
};
export const getOrderDetailSeller = (orderId) => {
    return apiGetAuth(`api/Orders/Seller/${orderId}`);
};