import { apiPostAuth } from '~/api/defaultApi';

export const sendMessageForUser = (id, data) => {
    return apiPostAuth(`api/Notifications/sendNotification/${id}`, data);
};
