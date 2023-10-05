import { apiPostAuth } from '../defaultApi';

export const addOrder = (data) => {
    return apiPostAuth(`api/Orders/AddOrder`, data);
};