import Cookies from 'js-cookie';
import { format, register } from 'timeago.js';

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

//For UI

export const formatTimeAgo = (time, localDate) => {
    register('my-locale', localeFunc);
    return format(time, 'my-locale');
    //console.log('time: ' + format('2023-08-20T10:30:00', 'hn_VN'));
};

const localeFunc = (number, index, totalSec) => {
    // number: the timeago / timein number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
        ['just now', 'right now'],
        [`${number} seconds ago`, `in ${number} seconds`],
        ['1 minute ago', 'in 1 minute'],
        [`${number} minutes ago`, `in ${number} minutes`],
        ['1 hour ago', 'in 1 hour'],
        [`${number} hours ago`, `in ${number} hours`],
        ['1 day ago', 'in 1 day'],
        [`${number} days ago`, `in ${number} days`],
        ['1 week ago', 'in 1 week'],
        [`${number} weeks ago`, `in ${number} weeks`],
        ['1 month ago', 'in 1 month'],
        [`${number} months ago`, `in ${number} months`],
        ['1 year ago', 'in 1 year'],
        [`${number} years ago`, `in ${number} years`],
    ][index];
};

export const formatTimeAgoVN = (time, localDate) => {
    register('vi', localeFuncVN);
    return format(time, 'vi');
    //console.log('time: ' + format('2023-08-20T10:30:00', 'hn_VN'));
};

const localeFuncVN = (number, index, totalSec) => {
    return [
        ['vừa xong', 'ngay bây giờ'],
        [`${number} giây trước`, `trong ${number} giây`],
        ['1 phút trước', 'trong 1 phút'],
        [`${number} phút trước`, `trong ${number} phút`],
        ['1 giờ trước', 'trong 1 giờ'],
        [`${number} giờ trước`, `trong ${number} giờ`],
        ['1 ngày trước', 'trong 1 ngày'],
        [`${number} ngày trước`, `trong ${number} ngày`],
        ['1 tuần trước', 'trong 1 tuần'],
        [`${number} tuần trước`, `trong ${number} tuần`],
        ['1 tháng trước', 'trong 1 tháng'],
        [`${number} tháng trước`, `trong ${number} tháng`],
        ['1 năm trước', 'trong 1 năm'],
        [`${number} năm trước`, `trong ${number} năm`],
    ][index];
};
