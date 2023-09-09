import { apiPostFile } from '../defaultApi';

export const userInfo = (data) => {
    return apiPostFile(`api/reports/user`, data);
};