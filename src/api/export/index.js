import { getTokenInCookies } from '~/utils';
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL;

const getConfig = () => {
    return {
        responseType: 'blob'
    };
};

const getHeaderConfigAuth = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenInCookies()}`,
            responseType: 'blob',
        },
    };
};

export const apiPosts = async (url, data) => {
    const response = axios.post(baseURL + url, data, getConfig());
    return response;
};


export const postUserExport = (data) => {
    return apiPosts(`api/export/user`, data);
};