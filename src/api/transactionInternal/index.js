import { apiPostAuth } from '../defaultApi';

export const getHistoryTransactionInternal = (data) => {
    return apiPostAuth(`api/TransactionInternals/data`, data);
};
