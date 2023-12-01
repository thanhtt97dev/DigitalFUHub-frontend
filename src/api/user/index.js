import { apiGet, apiGetAuth, apiPost, apiPostAuth, apiPut, apiPutAuthForm } from '../defaultApi';

export const login = (data, google = false) => {
    const url = google ? 'api/users/SignInGoogle' : 'api/users/signIn'
    return apiPost(url, data);
};
export const signUp = (data) => {
    return apiPost('api/users/SignUp', data);
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
export const checkExistEmail = async (email) => {
    return await apiGetAuth(`api/users/IsExistEmail/${email}`);
};
export const checkExistUsername = async (username) => {
    return await apiGetAuth(`api/users/IsExistUsername/${username}`);
};

export const activeUserNameAndPassword = (data) => {
    return apiPostAuth(`api/users/ActiveUserNameAndPassword`, data);
};

export const editUserInfo = (data) => {
    return apiPutAuthForm(`api/users/EditUserInfo`, data);
};

export const editFullNameUser = (data) => {
    return apiPut(`api/users/EditFullNameUser`, data);
};

export const editAvatarUser = (data) => {
    return apiPutAuthForm(`api/users/EditAvatarUser`, data);
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

export const getCustomerBalance = (id) => {
    return apiGetAuth(`api/users/getCustomerBalance/${id}`);
};

export const getCoinUser = (id) => {
    return apiGetAuth(`api/users/GetCoin/${id}`);
};

export const confirmEmail = (token) => {
    return apiGet(`api/users/ConfirmEmail/${token}`);
};
export const generateTokenConfirmEmail = (email) => {
    return apiGet(`api/users/GenerateTokenConfirmEmail/${email}`);
};
export const resetPassword = (email) => {
    return apiGet(`api/users/ResetPassword/${email}`);
};

export const updateAccountBalance = (id, data) => {
    return apiPut(`api/Users/UpdateBalance/${id}`, data);
};

export const getOnlineStatusUser = (id) => {
    return apiGetAuth(`api/users/GetOnlineStatusUser/${id}`);
};
