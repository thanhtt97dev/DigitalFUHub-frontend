import axios from 'axios'

import { getTokenInCookies } from '~/utils';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const getConfig = () => {
    return {
        responseType: 'blob'
    };
};


const getHeaderConfigAuth = () => {
    return {
        headers: {
            Authorization: `Bearer ${getTokenInCookies()}`,
            responseType: 'blob',
        },
    };
};


export const apiPost = async (url, data) => {
    const response = axios.post(baseURL + url, data, getConfig());
    return response;
};

export const apiPostAuth = async (url, data) => {
    const response = axios.post(baseURL + url, data, getHeaderConfigAuth());
    return response;
};


export const userInfo = (data) => {
    return apiPostAuth(`api/reports/user`, data);
};