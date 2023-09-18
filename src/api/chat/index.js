import { apiGet, apiPost } from '../defaultApi';
// import { apiGetAuth, apiPostAuth} from '../defaultApi';


export const getSenderConversations = (userId, page, limit) => {
    return apiGet(`api/Chats/getSenders?userId=${userId}&page=${page}&limit=${limit}`);
};

export const getListMessage = (conversationId) => {
    return apiGet(`api/Chats/getListMessage?conversationId=${conversationId}`);
};

export const sendMessage = (data) => {
    return apiPost('api/chats/SendMessage', data);
};