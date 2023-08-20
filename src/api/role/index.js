import { apiGet } from '../defaultApi';

export const getAllRoles = () => {
    return apiGet('api/roles/GetAllRoles');
};
