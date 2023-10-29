import { apiGet, apiGetAuth, apiPostAuth, apiPostAuthForm } from '../defaultApi';

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