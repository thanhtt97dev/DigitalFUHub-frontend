import Cookies from 'js-cookie';

//API

export const getTokenInCookies = () => {
    let token;
    if (typeof window !== 'undefined') {
        token = Cookies.get('_token');
    }
    return token;
};

export const getRefreshTokenInCookies = () => {
    let token;
    if (typeof window !== 'undefined') {
        token = Cookies.get('_auth_refresh');
    }
    return token;
};

export const getJwtId = () => {
    let jwtId;
    if (typeof window !== 'undefined') {
        jwtId = Cookies.get('_tid');
    }
    return jwtId;
};

export const getUserId = () => {
    let userId;
    if (typeof window !== 'undefined') {
        userId = Cookies.get('_uid');
    }
    return userId;
};

export const saveJwtIdToCookies = (jwtId) => {
    Cookies.remove('_tid');
    Cookies.set('_tid', jwtId, { expires: process.env.REACT_APP_TOKEN_EXPIRES_TIME });
};

export const saveDataAuthToCookies = (uid, token, refreshToken, jwtId) => {
    const time_expries = 15;

    Cookies.remove('_uid');
    Cookies.set('_uid', uid, { expires: time_expries });

    Cookies.remove('_token');
    Cookies.set('_token', token, { expires: time_expries });

    Cookies.remove('_auth_refresh');
    Cookies.set('_auth_refresh', refreshToken, { expires: time_expries });

    Cookies.remove('_tid');
    Cookies.set('_tid', jwtId, { expires: time_expries });
};

export const removeDataAuthInCookies = () => {
    Cookies.remove('_uid');

    Cookies.remove('_token');

    Cookies.remove('_auth_refresh');

    Cookies.remove('_tid');
};
