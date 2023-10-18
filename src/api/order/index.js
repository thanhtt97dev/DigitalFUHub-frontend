import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/AddOrder`, data);
};
export const getAllOrdersCustomer = (data) => {
    return apiPostAuth(`api/Orders/All`, data);
};
export const getOrderDetailCustomer = (userId, orderId) => {
    return apiGetAuth(`api/Orders/User/${userId}/${orderId}`);
};
export const customerUpdateStatusOrder = (data) => {
    return apiPostAuth(`api/Orders/Edit/Status`, data);
};