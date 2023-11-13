import { apiGet, apiPostAuthForm } from '../defaultApi';

export const getAllReasonReportProducts = () => {
    return apiGet(`api/ReasonReportProducts/GetAll`);
};

export const addReportProduct = (data) => {
    return apiPostAuthForm(`api/ReportProducts/add`, data);
};

