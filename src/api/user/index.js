import { apiPost, apiPostAuth } from '../defaultApi';

export const login = (data) => {
    return apiPost('api/users/signIn', data);
};

export const revokeToken = (data) => {
    return apiPostAuth('api/users/revokeToken', data);
};
