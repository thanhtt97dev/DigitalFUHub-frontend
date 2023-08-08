import { apiPost } from '../defaultApi';

export const login = (data) => {
    return apiPost('api/users/signIn', data);
};
