import { apiGetFile, apiPostForm } from '../defaultApi';

export const dowloadFile = (file) => {
    return apiGetFile(`api/Storages/GetFile/${file}`);
};

export const uploadFile = (data) => {
    return apiPostForm('api/Storages/Upload', data);
}
