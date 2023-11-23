/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getListShopSearch } from "~/api/shop";
import { SearchNotFound } from "~/components/SearchProduct";
import Shops from "~/components/SearchShop/Shops";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
function SearchShop() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [loading, setLoading] = useState(false);
    const [shops, setShops] = useState();
    const [totalItems, setTotalItems] = useState(0);
    const getSearchParams = useMemo(() => {
        return {
            keyword: searchParams.get('keyword') ? searchParams.get('keyword').trim() : '',
            page: searchParams.get('page') ? searchParams.get('page') : 1
        }
    }, [searchParams])
    useEffect(() => {
        setLoading(true);
        getListShopSearch(getSearchParams.keyword, getSearchParams.page)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setTotalItems(res.data.result.totalItems);
                    setShops(res.data.result.shops);
                } else {
                    setTotalItems(0);
                    setShops([]);
                }
            })
            .catch(err => {
                setTotalItems(0);
                setShops([]);
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, [searchParams]);
    const handleSelectPage = (value) => {
        let newSearchParams = { ...getSearchParams, page: value }
        return navigate(`/searchShop?keyword=${newSearchParams.keyword}&page=${newSearchParams.page}`)
    }
    return (<>
        <Spin spinning={loading}>
            <Layout style={{
                minHeight: '100vh',
                margin: '0 9em',
                backgroundColor: '#f4f7fe'
            }} >
                {!loading && shops && shops.length > 0 ?
                    <Shops
                        listShop={shops}
                        totalItems={totalItems}
                        keyword={getSearchParams.keyword}
                        page={getSearchParams.page}
                        onSelectPage={handleSelectPage}
                    />
                    :
                    <SearchNotFound />
                }
            </Layout>
        </Spin >
    </>);
}

export default SearchShop;