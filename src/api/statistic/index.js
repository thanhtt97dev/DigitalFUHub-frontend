import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const getStatisticSales = (data) => {
    return apiPostAuth("/api/Statistics/Sales", data);
}
export const getStatisticSalesCurrentMonth = () => {
    return apiGetAuth("/api/Statistics/CurrentMonth");
}
export const getTodoList = () => {
    return apiGetAuth("/api/Statistics/TodoList");
}