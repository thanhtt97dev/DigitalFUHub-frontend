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

export const saveDataAuthToCookies = (token, refreshToken, accessTokenId) => {
    Cookies.remove('_auth');
    Cookies.set('_auth', token, { expires: 7 });
    Cookies.remove('_auth_refresh');
    Cookies.set('_auth_refresh', refreshToken, { expires: 7 });
    Cookies.remove('_tid');
    Cookies.set('_tid', accessTokenId, { expires: 7 });
};

export const saveAccessTokenIdToCookies = (accessTokenId) => {
    Cookies.remove('_tid');
    Cookies.set('_tid', accessTokenId, { expires: 7 });
};

export const removeAccessTokenIdToCookies = () => {
    Cookies.remove('_tid');
};
