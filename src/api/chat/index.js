import { apiPostAuth, apiGetAuth, apiPostAuthForm } from '../defaultApi';

export const GetConversations = (userId) => {
    return apiGetAuth(`api/Conversations/getConversations?userId=${userId}`);
};

export const GetMessages = (conversationId) => {
    return apiGetAuth(`api/Conversations/getMessages?conversationId=${conversationId}`);
};

export const sendMessage = (formData) => {
    return apiPostAuthForm('api/Conversations/SendMessage', formData);
};

export const addConversation = (data) => {
    return apiPostAuth('api/Conversations/add', data);
};


export const updateUserConversation = (data) => {
    return apiPostAuth('api/UserConversations/update', data);
};

export const getConversation = (data) => {
    return apiPostAuth('api/Conversations/GetConversation', data);
};

export const getNumberConversationUnRead = (userId) => {
    return apiGetAuth(`api/Conversations/getNumberConversationUnRead?userId=${userId}`);
};

export const getConversationsUnRead = (userId) => {
    return apiGetAuth(`api/Conversations/GetConversationsUnRead/${userId}`);
};

