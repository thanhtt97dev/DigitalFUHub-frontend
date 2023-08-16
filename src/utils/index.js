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

export const saveDataAuthToCookies = (token, refreshToken) => {
    Cookies.remove('_auth');
    Cookies.set('_auth', token, { expires: 7 });
    Cookies.remove('_auth_refresh');
    Cookies.set('_auth_refresh', refreshToken, { expires: 7 });
};
