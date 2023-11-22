/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, Card, Col, Divider, Layout, Row, Space, Spin } from 'antd';
import classNames from "classnames/bind";
import { ALL_CATEGORY, FEEDBACK_TYPE_ALL, RESPONSE_CODE_SUCCESS, SORTED_BY_SALE } from "~/constants";
import { BulbOutlined, ClockCircleOutlined, FilterOutlined, ShoppingOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { getAllCategory } from "~/api/category";
import { getListProductSearch } from "~/api/product";
import styles from "./Search.module.scss"
import { FilterGroupCategory, FilterGroupRating, InputRangePrice, Products, SortBar } from "~/components/SearchProduct";
const cx = classNames.bind(styles);
const { Sider, Content } = Layout;

function ConvertSearchParamObjectToString(searchParam = {}) {
    let result = '';
    for (const property in searchParam) {
        if (searchParam[property]) {
            result += `${property}=${searchParam[property]}&`;
        }
    }
    return result.slice(0, result.length - 1)
}

function MostPopularShop({ keyword }) {
    return (
        <Space direction="vertical" style={{ marginBottom: '1em', width: '100%' }}>
            <div style={{ marginBottom: '1em' }}>
                <span
                    style={{
                        fontSize: 16
                    }}>
                    Cửa hàng liên quan đến
                    '<span style={{ color: '#1677ff' }}>{keyword}</span>'
                </span>
            </div>
            <Link to={`/shop/${1}`}>
                <Card hoverable>
                    <Row>
                        <Col span={8} style={{ paddingInlineEnd: '0.8em', borderRight: '1px solid rgb(232, 232, 232)' }}>
                            <Space>
                                <Avatar size={60} icon={<UserOutlined />} />
                                <div>
                                    <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '18px' }}>TÊN SHOP</div>
                                    <div className={cx('three-dot-overflow-one-line-wrapper')} style={{ fontSize: '14px' }}>username</div>
                                </div>
                            </Space>
                        </Col>
                        <Col span={16}>
                            <Row justify="end" style={{ height: '100%' }}>
                                <Space size={[84, 8]} align="center">
                                    <div>Sản phẩm: 3 <ShoppingOutlined /></div>
                                    <div>Đánh giá: 3 <StarOutlined /></div>
                                    <div>Tham gia: 11 ngày trước <ClockCircleOutlined /></div>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </Space>
    )
}
function SearchProduct() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const getSearchParams = useMemo(() => {
        return {
            page: searchParams.get('page') ? searchParams.get('page') : 1,
            keyword: searchParams.get('keyword') ? searchParams.get('keyword') : '',
            category: searchParams.get('category') ? searchParams.get('category') : ALL_CATEGORY,
            sort: searchParams.get('sort') ? searchParams.get('sort') : SORTED_BY_SALE,
            minPrice: searchParams.get('minPrice') ? searchParams.get('minPrice') : null,
            maxPrice: searchParams.get('maxPrice') ? searchParams.get('maxPrice') : null,
            rating: searchParams.get('rating') ? searchParams.get('rating') : FEEDBACK_TYPE_ALL
        }
    }, [searchParams])
    useEffect(() => {
        setLoading(true);
        getListProductSearch(getSearchParams)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProducts(res.data.result.products);
                    setTotalItems(res.data.result.totalItems);
                }
            })
            .catch(err => {
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout)
                }, 500)
            })
    }, [searchParams]);
    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === "00") {
                    setCategories(res.data.result)
                } else {
                    setCategories([])
                }
            })
            .catch((err) => {
                setCategories([])
            })
    }, [searchParams])
    const handleChangeSelectRating = (e) => {
        let newSearchParams = { ...getSearchParams, rating: e.target.value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleInputRangePrice = (minPrice, maxPrice) => {
        let newSearchParams = { ...getSearchParams, minPrice, maxPrice };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleChangeSelectCategory = (e) => {
        let newSearchParams = { ...getSearchParams, category: e.target.value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleChangeSelectSort = (e) => {
        let newSearchParams = { ...getSearchParams, sort: e.target.value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleSelectPage = (value) => {
        let newSearchParams = { ...getSearchParams, page: value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    return (
        <Spin spinning={loading}>
            <Layout className={cx('container')} >
                <Sider className={cx('sider')}>
                    <Space style={{ marginBottom: '1.8em' }}>
                        <FilterOutlined style={{ fontSize: '1.17em' }} />
                        <h3> Bộ Lọc Tìm Kiếm</h3>
                    </Space>
                    <FilterGroupCategory
                        valueSelected={parseInt(getSearchParams.category) ? parseInt(getSearchParams.category) : ALL_CATEGORY}
                        listCategory={categories}
                        onChange={handleChangeSelectCategory}
                    />
                    <Divider />
                    <InputRangePrice
                        minValue={parseInt(getSearchParams.minPrice) ? parseInt(getSearchParams.minPrice) : null}
                        maxValue={parseInt(getSearchParams.maxPrice) ? parseInt(getSearchParams.maxPrice) : null}
                        onChange={handleInputRangePrice} />
                    <Divider />
                    <FilterGroupRating
                        valueSelected={parseInt(getSearchParams.rating)}
                        onChange={handleChangeSelectRating}
                    />
                </Sider>
                <Layout className={cx('wrapper-content')}>
                    <Content className={cx('content')}>
                        <MostPopularShop keyword={getSearchParams.keyword} />
                        <div style={{ marginBottom: '1em' }}>
                            <BulbOutlined style={{ fontSize: 18 }} />
                            <span style={{ marginInlineStart: '0.8em', fontSize: 16 }}>Kết quả tìm kiếm cho từ khoá
                                '<span style={{ color: '#1677ff' }}>{getSearchParams.keyword}</span>'
                            </span>
                        </div>
                        <SortBar
                            valueSelected={parseInt(getSearchParams.sort)}
                            onChange={handleChangeSelectSort}
                        />
                        <Products products={products} totalItems={totalItems} page={parseInt(getSearchParams.page) ? parseInt(getSearchParams.page) : 1} onSelectPage={handleSelectPage} />
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
}

export default SearchProduct;