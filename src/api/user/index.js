import { apiGetAuth, apiPost, apiPostAuth, apiPut, apiPostRealTime } from '../defaultApi';

export const login = (data) => {
    return apiPost('api/users/signIn', data);
};

export const refreshToken = (accessToken, refreshToken) => {
    const data = {
        refreshToken,
        accessToken,
    };
    return apiPost('api/users/refreshToken', data);
};

export const revokeToken = (data) => {
    return apiPostAuth('api/users/revokeToken', data);
};

export const getUsersByCondition = (data) => {
    if (data === undefined) {
        data = {
            email: '',
            roleId: '0',
            status: '-1',
        };
    }
    return apiGetAuth(`api/users/GetUsers?email=${data.email}&role=${data.roleId}&status=${data.status}`);
};

export const getUserById = (id) => {
    return apiGetAuth(`api/users/GetUserById/${id}`);
};

export const editUserInfo = (id, data) => {
    return apiPut(`api/users/EditUserInfo/${id}`, data);
};

export const sendNotification = (id, data) => {
    return apiPostRealTime(`api/Notifications/sendNotification/${id}`, data);
};
