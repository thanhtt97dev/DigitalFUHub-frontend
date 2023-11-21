import { apiGet } from '../defaultApi';

export const getSearchHint = (keyword) => {
    return apiGet(`api/Search/SearchHint?keyword=${keyword}`);
}