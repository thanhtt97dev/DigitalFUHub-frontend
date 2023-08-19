import Cookies from 'js-cookie';

//API

export const getToken = () => {
    let token;

    if (typeof window !== 'undefined') {
        token = Cookies.get('_auth');
    }
    console.log(token);
    return token;
};

export const getRefreshToken = () => {
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

export const saveJwtIdToCookies = (jwtId) => {
    Cookies.remove('_tid');
    Cookies.set('_tid', jwtId, { expires: process.env.REACT_APP_TOKEN_EXPIRES_TIME });
};

export const saveDataAuthToCookies = (token, refreshToken, jwtId) => {
    const time_expries = 15;

    Cookies.remove('_auth');
    Cookies.set('_auth', token, { expires: time_expries });

    Cookies.remove('_auth_refresh');
    Cookies.set('_auth_refresh', refreshToken, { expires: time_expries });

    Cookies.remove('_tid');
    Cookies.set('_tid', jwtId, { expires: time_expries });
};
