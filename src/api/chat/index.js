import { apiGet, apiPost } from '../defaultApi';
// import { apiGetAuth, apiPostAuth} from '../defaultApi';


export const getSenderConversations = (userId) => {
    return apiGet(`api/Chats/getSenders?userId=${userId}`);
};

export const getListMessage = (conversationId) => {
    return apiGet(`api/Chats/getListMessage?conversationId=${conversationId}`);
};

export const sendMessage = (data) => {
    return apiPost('api/chats/SendMessage', data);
};

export const existUserConversation = (senderId, recipientId) => {
    return apiGet(`api/Chats/existUserConversation?senderId=${senderId}&recipientId=${recipientId}`);
};