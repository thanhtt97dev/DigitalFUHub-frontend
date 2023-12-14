import { apiGetAuth, apiPostAuthForm, apiGet } from '../defaultApi';

export const getShopOfSeller = () => {
    return apiGetAuth(`api/Shops/Seller/Get`);
}
export const checkShopUser = () => {
    return apiGetAuth(`api/Shops/Exist`);
}
export const editShop = (data) => {
    return apiPostAuthForm('api/Shops/Seller/Edit', data);
}

export const checkExistShopName = async (data) => {
    return await apiGetAuth(`api/Shops/IsExistShopName/${data}`);
};

export const registerShop = (data) => {
    return apiPostAuthForm('api/Shops/Register', data);
}

export const getShopDetail = (userId) => {
    return apiGet(`api/Shops/GetDetail/${userId}`);
}

export const getMostPopularShop = (keyword) => {
    return apiGet(`api/Shops/MostPopular?keyword=${keyword}`);
}
export const getListShopSearch = (keyword, page) => {
    return apiGet(`api/Shops/Search?keyword=${keyword}&page=${page}`);
}
