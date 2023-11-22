import { apiGet } from '../defaultApi';

export const getSearchHint = (keyword) => {
    return apiGet(`api/Searchs/SearchHint?keyword=${keyword}`);
}