import { apiGet } from '../defaultApi';

export const getFee = () => {
    return apiGet('api/shopRegisterFees/Fee');
};
