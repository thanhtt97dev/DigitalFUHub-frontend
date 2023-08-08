//API

export const getToken = () => {
    let token;

    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('_auth');
    }
    return token;
};

export const getRefreshToken = () => {
    let token;

    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('_auth_refresh');
    }
    return token;
};

export const saveRefreshTokenInlocalStorage = (token, refreshToken) => {
    localStorage.removeItem('_auth');
    localStorage.setItem('_auth', token);
    localStorage.removeItem('_auth_refresh');
    localStorage.setItem('_auth_refresh', refreshToken);
    console.log(refreshToken);
};
