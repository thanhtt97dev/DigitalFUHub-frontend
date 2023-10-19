import { apiGet, apiPostAuthForm } from '../defaultApi';

export const getFeedbackByProductId = (productId) => {
    return apiGet(`api/Feedbacks/GetAll?productId=${productId}`);
};

export const addFeedbackOrder = (data) => {
    return apiPostAuthForm("api/Feedbacks/Add", data);
}