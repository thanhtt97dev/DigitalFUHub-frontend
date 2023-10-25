import { apiGet, apiPost, apiPostAuth } from '../defaultApi';

export const GetUsersConversation = (userId) => {
    return apiGet(`api/Conversations/getUsers?userId=${userId}`);
};

export const GetMessages = (conversationId) => {
    return apiGet(`api/Conversations/getMessages?conversationId=${conversationId}`);
};

export const sendMessage = (data) => {
    return apiPost('api/Conversations/SendMessage', data);
};

export const addConversation = (data) => {
    return apiPost('api/Conversations/add', data);
};


export const updateUserConversation = (data) => {
    return apiPostAuth('api/UserConversations/update', data);
};

export const getConversation = (data) => {
    return apiPostAuth('api/Conversations/GetConversation', data);
};

