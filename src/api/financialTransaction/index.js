import { apiPostAuth } from '../defaultApi';

export const createDepositTransaction = (data) => {
    return apiPostAuth('api/financialTransaction/CreateDepositTransaction', data);
};


