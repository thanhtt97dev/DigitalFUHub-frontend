import { apiGet, apiGetAuth, apiPostAuthForm } from '../defaultApi';

export const getFeedbackByProductId = (productId) => {
    return apiGet(`api/Feedbacks/GetAll?productId=${productId}`);
};

export const addFeedbackOrder = (data) => {
    return apiPostAuthForm("api/Feedbacks/Customer/Add", data);
}
export const getFeedbackDetail = (orderId) => {
    return apiGetAuth(`api/Feedbacks/Customer/${orderId}`);
}