import { apiGetAuth, apiPostAuth } from '../defaultApi';


export const getUserBankAccount = (id) => {
    return apiGetAuth(`api/banks/user/${id}`);
};

export const getAllBankInfo = () => {
    return apiGetAuth('api/banks/getAll');
};

export const testConnect = () => {
    return apiGetAuth('api/banks/connect');
};

export const inquiryAccountName = (data) => {
    return apiPostAuth('api/banks/inquiryAccountName', data);
};

export const addBankAccount = (data) => {
    return apiPostAuth('api/banks/addBankAccount', data);
};




