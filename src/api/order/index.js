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
    return apiPostAuth('api/Orders/Seller/List', data);
};
export const getOrderDetailSeller = (userId, orderId) => {
    return apiGetAuth(`api/Orders/Seller/${userId}/${orderId}`);
};
export const updateRefundOrder = (data) => {
    return apiPostAuth(`api/Orders/Seller/Refund`, data);
};
export const updateDisputeOrder = (data) => {
    return apiPostAuth(`api/Orders/Seller/Dispute`, data);
};