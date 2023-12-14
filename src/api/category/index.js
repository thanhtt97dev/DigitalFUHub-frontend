import { apiGet } from '../defaultApi';

export const getAllCategory = () => {
    return apiGet('api/Categories/GetAll');
};