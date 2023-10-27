import axios from 'axios';
import { getTokenInCookies, getUserId } from '~/utils';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const headerWithToken = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenInCookies()}`,
            'Session-userId': getUserId()
        },
    };
};

const headerWithTokenForFile = () => {
    return {
        headers: {
            Authorization: `Bearer ${getTokenInCookies()}`,
            'Session-userId': getUserId()
        },
        responseType: 'blob'
    };
};
const headerWithTokenForForm = () => {
    return {
        headers: {
            Authorization: `Bearer ${getTokenInCookies()}`,
            'Content-Type': "multipart/form-data",
            'Session-userId': getUserId()
        },
    };
};



export const apiGet = async (url) => {
    const response = axios.get(url);
    return response;
};
export const apiGetFile = async (url) => {
    const response = axios.get(url, headerWithTokenForFile());
    return response;
};

export const apiGetAuth = async (url) => {
    const response = axios.get(url, headerWithToken());
    return response;
};

export const apiPut = async (url, data) => {
    const response = axios.put(url, data, headerWithToken());
    return response;
};

export const apiPost = async (url, data) => {
    const response = axios.post(url, data);
    return response;
};

export const apiPostForm = async (url, data) => {
    const response = axios.post(url, data, { "Content-Type": "multipart/form-data" },);
    return response;
};

export const apiPostAuthForm = async (url, data) => {
    const response = axios.post(url, data, headerWithTokenForForm());
    return response;
};

export const apiPutAuthForm = async (url, data) => {
    const response = axios.put(url, data, headerWithTokenForForm());
    return response;
};

export const apiPostAuth = async (url, data) => {
    const response = axios.post(url, data, headerWithToken());
    return response;
};

export const apiPostFile = async (url, data) => {
    const response = axios.post(url, data, headerWithTokenForFile());
    return response;
};

export const apiDelete = async (url, data) => {
    const response = axios.delete(url, data, headerWithToken());
    return response;
};
