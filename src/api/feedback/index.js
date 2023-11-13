import { apiGet, apiGetAuth, apiPostAuth, apiPostAuthForm, apiPost } from '../defaultApi';

export const getFeedbackByProductId = (productId) => {
    return apiGet(`api/Feedbacks/GetAll?productId=${productId}`);
};

export const addFeedbackOrder = (data) => {
    return apiPostAuthForm("api/Feedbacks/Customer/Add", data);
}
export const getFeedbackDetail = (userId, orderId) => {
    return apiGetAuth(`api/Feedbacks/Customer/${userId}/${orderId}`);
}
export const getListFeedbackSeller = (data) => {
    return apiPostAuth(`api/Feedbacks/Seller/List`, data);
}

export const search = (data) => {
    return apiPost(`api/Feedbacks/search`, data);
}