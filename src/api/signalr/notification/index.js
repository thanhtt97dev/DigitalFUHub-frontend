import { apiPost } from '~/api/signalr/defaultApi';

export const sendMessageForUser = (id, data) => {
    return apiPost(`api/Notifications/sendNotification/${id}`, data);
};
