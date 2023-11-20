import Cookies from 'js-cookie';
import { format, register } from 'timeago.js';
import jwtDecode from 'jwt-decode'
import CryptoJS from 'crypto-js';
import DOMPurify from "dompurify";
import { Workbook } from 'exceljs'

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

export const getUser = () => {
    let user;
    if (typeof window !== 'undefined') {
        user = Cookies.get('_auth_state');
    }
    return user;
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
    Cookies.remove('_auth_state');

    Cookies.remove('_uid');

    Cookies.remove('_token');

    Cookies.remove('_auth_refresh');

    Cookies.remove('_tid');
};

export const removeUserInfoInCookie = () => {
    Cookies.remove('_auth_state');
}

//For UI

export const formatTimeAgoCustom = (time) => {
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

export const formatTimeAgoVN = (time) => {
    return format(time, 'vi');
    //console.log('time: ' + format('2023-08-20T10:30:00', 'hn_VN'));
};


export function ParseDateTime(inputDate) {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

export const decodeGoogleCredential = (credential) => {
    return jwtDecode(credential);
}

export function encryptPassword(password) {
    var hash = CryptoJS.SHA256(password);
    return hash.toString(CryptoJS.enc.Hex)
}

export function regexPattern(value, pattern) {
    return value.match(pattern);
}

export function readDataFileExcelImportProduct(file) {
    return new Promise((resolve, reject) => {
        const wb = new Workbook();
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then(workbook => {
                // console.log(workbook, 'workbook instance')
                workbook.eachSheet((sheet, id) => {
                    let data = []
                    sheet.eachRow((row, rowIndex) => {
                        if (rowIndex !== 1 && (row.values[1] + '').trim()) {
                            data.push({ index: rowIndex - 1, value: row.values[1] })
                        }
                    })
                    resolve(data);
                })

            })
        }
    })
}

export function cleanHTML(dirtyHTML) {
    return DOMPurify.sanitize(dirtyHTML, {
        USE_PROFILES: { html: true },
    });
}

export async function writeDataToExcel(data) {

    const wb = new Workbook();
    const ws = wb.addWorksheet('Sheet1');

    const columns = [
        {
            key: 'name',
            header: `Thông Tin\n(tài khoản/mật khẩu)\n(1)`,
            width: 40,
            style: {
                font: {
                    size: 12,
                    bold: true,
                    name: 'Times New Roman'
                },
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                }
            }
        },
    ];
    ws.columns = columns;
    data.forEach((v) => {
        let row = ws.addRow([v.asset]);
        row.font = {
            size: 12,
            name: 'Times New Roman'
        }

    });
    return await wb.xlsx.writeBuffer();
}

export function formatPrice(price) {
    if (price === undefined) return 0
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Số lẻ sau dấu phẩy
    });
}

export const getVietnamCurrentTime = () => {
    const currentTime = new Date();
    const vietnamTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toISOString();
}

export function discountPrice(price, discount) {
    const result = price * discount / 100
    return (price - result)
}

export const stringGuid = () => {
    let str = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < 8; i++) {
        let index = Math.floor(Math.random() * str.length)
        result += str[index]
    }
    return result
}

export function formatNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + ' tr';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + ' k';
    } else {
        return number.toString();
    }
}
export function getDistanceDayTwoDate(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diff = Math.abs(d2 - d1);
    return diff / (24 * 60 * 60 * 1000)
}


