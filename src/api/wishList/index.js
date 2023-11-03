import { apiGetAuth, apiPostAuth } from '../defaultApi';


export const isProductWishList = (productId, userId) => {
    return apiGetAuth(`api/WishLists/IsWishList?productId=${productId}&userId=${userId}`);
};

export const addWishList = (data) => {
    return apiPostAuth(`api/WishLists/Add`, data);
};

export const removeWishList = (data) => {
    return apiPostAuth(`api/WishLists/Remove`, data);
};

export const getWishListByUserId = (userId) => {
    return apiGetAuth(`api/WishLists/GetByUserId/${userId}`);
};