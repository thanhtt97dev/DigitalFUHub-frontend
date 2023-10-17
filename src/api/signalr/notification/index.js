import { apiPostAuth, apiPutAuthForm } from '~/api/defaultApi';

export const sendMessageForUser = (id, data) => {
    return apiPostAuth(`api/Notifications/sendNotification/${id}`, data);
};

export const editNotificationIsReaded = (id) => {
    return apiPutAuthForm(`api/Notifications/editNotificationIsReaded/${id}`);
};