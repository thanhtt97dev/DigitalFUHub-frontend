import { apiPostAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/AddOrder`, data);
};
export const getOrders = (data) => {
    return apiPostAuth(`api/Orders/All`, data);
};

export const editStatusOrder = (data) => {
    return apiPostAuth(`api/Orders/Edit/Status`, data);
};