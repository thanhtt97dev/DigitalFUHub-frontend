import { apiGetAuth, apiPost, apiPostAuth, apiPut } from '../defaultApi';

export const login = (data) => {
    return apiPost('api/users/signIn', data);
};

export const generateAccessToken = (id, data) => {
    return apiPost(`api/users/GenerateAccessToken/${id}`, data);
}

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

export const getUserByIdForAuth = (id) => {
    return apiGetAuth(`api/users/GetUser/${id}`);
};

export const getUserById = (id) => {
    return apiGetAuth(`api/users/GetUserById/${id}`);
};

export const editUserInfo = (id, data) => {
    return apiPut(`api/users/EditUserInfo/${id}`, data);
};

export const postUserInfo = (id, data) => {
    return apiPut(`api/users/EditUserInfo/${id}`, data);
};

export const generate2FaKey = (id) => {
    return apiPostAuth(`api/users/Generate2FaKey/${id}`);
};

export const activate2Fa = (id, data) => {
    return apiPostAuth(`api/users/Activate2Fa/${id}`, data);
};

export const deactivate2Fa = (id, data) => {
    return apiPostAuth(`api/users/Deactivate2Fa/${id}`, data);
};

export const send2FaQrCode = (id) => {
    return apiPostAuth(`api/users/Send2FaQrCode/${id}`);
};
