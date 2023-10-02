import Cookies from 'js-cookie';
import { format, register } from 'timeago.js';
import jwtDecode from 'jwt-decode'
import CryptoJS from 'crypto-js';
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


export function formatStringToCurrencyVND(number) {
    number = number + "";
    var length = number.length;
    var count = 0;
    if (length % 3 === 0) {
        count = -1;
    } else {
        count = 0;
    }
    for (let i = length - 1; i >= 0; i--) {
        if ((i + 1) % 3 === 0) {
            count++
        }
    }
    var result = number.split("");
    var mod = number.length % 3;
    var positions = [];
    let position = 0;
    for (let i = 0; i <= count; i++) {
        if (mod % 3 === 0) {
            position = 0;
            if (i === 0) continue;
            if (i === 1) {
                position = i * 3;
            } else {
                position = i * 3 + i - 1;
            }
            positions.push(position);
        } else {
            if (i === count) continue;
            position = 0;
            if (i === 0) {
                position = i * 3 + mod
            } else {
                position = i * 3 + mod + i
            }
            positions.push(position);
        }
    }
    let temp;
    for (let i = 0; i < positions.length; i++) {
        var array = [","];
        result = result.concat(array);
        if (mod % 3 === 0) {
            temp = result[positions[i]];
            for (let j = result.length - 1; j >= 0; j--) {
                if (j >= positions[i]) {
                    result[j] = result[j - 1]
                }
            }
            result[positions[i] - 1] = temp;
            result[positions[i]] = ",";
        } else {
            temp = result[0];
            for (let j = result.length - 1; j > mod; j--) {
                if (j >= positions[i]) {
                    result[j] = result[j - 1]
                }
            }

            result[positions[i]] = ",";
        }


    }
    var x = "";
    for (let i = 0; i < result.length; i++) {
        x += result[i];
    }
    return x;
}

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
                        if (rowIndex !== 1) {
                            data.push({ index: rowIndex - 1, value: row.values[1] })
                        }
                    })
                    resolve(data);
                })

            })
        }
    })


    // wb.xlsx.readFile(buffer).then(() => {

    //     const ws = wb.getWorksheet('Sheet1');

    //     const c1 = ws.getColumn(1);

    //     c1.eachCell(c => {

    //         console.log(c.value);
    //     });

    //     const c2 = ws.getColumn(2);

    //     c2.eachCell(c => {

    //         console.log(c.value);
    //     });
    // }).catch(err => {
    //     console.log(err.message);
    // });
}


export function formatPrice(price) {
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Số lẻ sau dấu phẩy
        maximumFractionDigits: 0, // Số lẻ sau dấu phẩy
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

