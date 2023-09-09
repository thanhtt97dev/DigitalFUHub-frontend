import { apiGetFile, apiPostForm } from '../defaultApi';

export const dowloadFile = (url) => {
    return apiGetFile(url);
};

export const uploadFile = (url, data) => {
    return apiPostForm(url, data);
}
