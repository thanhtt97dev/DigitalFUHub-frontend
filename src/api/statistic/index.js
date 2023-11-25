import { apiPostAuth, } from '../defaultApi';

export const getStatisticSales = (data) => {
    return apiPostAuth("/api/statistics/sales", data);
}