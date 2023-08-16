import axios from 'axios';
import { API_BASE_URL } from './config';
import { getToken } from '~/utils';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const getHeaderConfig = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
    };
};

export const apiGet = async (url) => {
    const response = axios.get(url);
    return response;
};

export const apiGetAuth = async (url) => {
    const response = axios.get(url, getHeaderConfig());
    return response;
};

export const apiPut = async (url, data) => {
    const response = axios.put(url, data);
    return response;
};

export const apiPutAuth = async (url, data) => {
    const response = axios.put(url, data, getHeaderConfig());
    return response;
};

export const apiPost = async (url, data) => {
    const response = axios.post(url, data);
    return response;
};

export const apiPostAuth = async (url, data) => {
    const response = axios.post(url, data, getHeaderConfig());
    return response;
};

export const apiDelete = async (url, data) => {
    const response = axios.delete(url, data);
    return response;
};

export const apiDeleteAuth = async (url, data) => {
    const response = axios.delete(url, data, getHeaderConfig());
    return response;
};
