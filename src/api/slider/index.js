import { apiGet } from '../defaultApi';

export const getSliders = () => {
    return apiGet(`api/Sliders/getAll`);
};

