import { apiPostAuth, apiPutAuthForm, apiGetAuth } from '~/api/defaultApi';

export const sendMessageForUser = (id, data) => {
    return apiPostAuth(`api/Notifications/sendNotification/${id}`, data);
};

export const editNotificationIsReaded = (id) => {
    return apiPutAuthForm(`api/Notifications/editNotificationIsReaded/${id}`);
};

export const editReadAllNotifications = (id) => {
    return apiPutAuthForm(`api/Notifications/editReadAllNotifications/${id}`);
};

export const fetchMoreNotifications = (data) => {
    return apiPostAuth(`api/Notifications/fetchMoreNotifications`, data);
};
