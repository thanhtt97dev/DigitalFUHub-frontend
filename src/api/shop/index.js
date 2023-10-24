import { apiGetAuth, apiPostAuth } from '../defaultApi';

export const checkExistShopName = async (data) => {
    return await apiGetAuth(`api/Shops/IsExistShopName/${data}`);
};

export const registerShop = (data) => {
    return apiPostAuth('api/Shops/Register', data);
}