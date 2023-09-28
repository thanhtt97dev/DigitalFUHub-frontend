import { apiGet } from '../defaultApi';

export const getFeedbackByProductId = (productId) => {
    return apiGet(`api/Feedbacks/GetAll?productId=${productId}`);
};