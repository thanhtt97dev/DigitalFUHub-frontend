import { apiGetAuth } from '../defaultApi';

export const checkExistShopName = async (data) => {
    return await apiGetAuth(`api/Shops/CheckExistShopName/${data}`);
};
