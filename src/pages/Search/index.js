/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Col, Divider, Form, InputNumber, Layout, Pagination, Radio, Rate, Row, Space, Typography } from 'antd';
import classNames from "classnames/bind";
import styles from "./Search.module.scss"
import { ALL_CATEGORY, FEEDBACK_TYPE_1_STAR, FEEDBACK_TYPE_2_STAR, FEEDBACK_TYPE_3_STAR, FEEDBACK_TYPE_4_STAR, FEEDBACK_TYPE_5_STAR, FEEDBACK_TYPE_ALL, PAGE_SIZE_SEARCH_PRODUCT, PRODUCT_BAN, RESPONSE_CODE_SUCCESS, SORTED_BY_DATETIME, SORTED_BY_PRICE_ASC, SORTED_BY_PRICE_DESC, SORTED_BY_SALE } from "~/constants";
import { FilterOutlined } from "@ant-design/icons";
import { getAllCategory } from "~/api/category";
import { getListProductSearch } from "~/api/product";
import { discountPrice, formatNumber, formatPrice } from "~/utils";
const cx = classNames.bind(styles);
const { Sider, Content } = Layout;
const { Text } = Typography

function FilterGroupRating({ valueSelected, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Đánh Giá</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" value={valueSelected} onChange={onChange}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space.Compact direction="vertical" style={{ width: '100%' }}>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_5_STAR}>
                            <Rate className={cx('rate')} value={5} disabled />
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_4_STAR}>
                            <Rate className={cx('rate')} value={4} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_3_STAR}>
                            <Rate className={cx('rate')} value={3} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_2_STAR}>
                            <Rate className={cx('rate')} value={2} disabled />  <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_1_STAR}>
                            <Rate className={cx('rate')} value={1} disabled /> <span >trở lên</span>
                        </Radio.Button>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={FEEDBACK_TYPE_ALL}>
                            <Rate className={cx('rate')} value={0} disabled /> <span >trở lên</span>
                        </Radio.Button>
                    </Space.Compact>
                </Space>
            </Radio.Group>
        </>
    );
}
function FilterGroupCategory({ listCategory = [], valueSelected = ALL_CATEGORY, onChange = () => { } }) {
    return (
        <>
            <legend className={cx('filter-header')}>Danh Mục</legend>
            <Radio.Group style={{ width: '100%' }} buttonStyle="solid" value={valueSelected} onChange={onChange}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space.Compact direction="vertical" style={{ width: '100%' }}>
                        <Radio.Button className={cx('radio-button', 'search-radio-button-checked')} value={ALL_CATEGORY}>
                            <div>Tất cả</div>
                        </Radio.Button>
                        {listCategory?.map((value, index) =>
                            <Radio.Button key={index} className={cx('radio-button', 'search-radio-button-checked')} value={value.categoryId}>
                                <div>{value.categoryName}</div>
                            </Radio.Button>
                        )}
                    </Space.Compact>
                </Space>
            </Radio.Group>
        </>
    );
}
function InputRangePrice({ minValue = null, maxValue = null, onChange = () => { } }) {
    const [msgError, setMsgError] = useState('');
    const [minPrice, setMinPrice] = useState(minValue);
    const [maxPrice, setMaxPrice] = useState(maxValue);
    useEffect(() => {
        setMinPrice(minValue);
        setMaxPrice(maxValue);
    }, [minValue, maxValue]);

    const handleInputChange = () => {
        // refresh message error
        if (msgError.trim()) {
            setMsgError('')
        }
    }
    const handleSubmitForm = ({ min, max }) => {
        setMinPrice(min);
        setMaxPrice(max);
        if (min && max && min >= max) {
            setMsgError('Vui lòng điền khoảng giá phù hợp')
        } else {
            setMsgError('');
            onChange(min, max);
        }
    }
    return (
        <>
            <legend className={cx('filter-header')}>Khoảng Giá</legend>
            <Form
                onFinish={handleSubmitForm}
                fields={[
                    {
                        name: 'min',
                        value: minPrice
                    },
                    {
                        name: 'max',
                        value: maxPrice
                    }
                ]}
            >
                <Row gutter={[8, 0]}>
                    <Col span={11}>
                        <Form.Item name='min' style={{ width: '100%' }} >
                            <InputNumber onInput={handleInputChange} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Từ" />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <div>_</div>
                    </Col>
                    <Col span={11}>
                        <Form.Item name='max' style={{ width: '100%' }} >
                            <InputNumber onInput={handleInputChange} style={{ width: '100%' }} min={0} max={1000000000} placeholder="Đến" />
                        </Form.Item>
                    </Col>
                </Row>
                {msgError &&
                    <Row style={{ margin: '-1em 0 1em 0' }}>
                        <Col span={24}>
                            <Text type="danger" style={{ fontSize: '13px' }}>{msgError}</Text>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Áp Dụng</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

function SortBar({ valueSelected = SORTED_BY_SALE, onChange = () => { } }) {
    return (
        <Space className={cx('wrapper-sort-bar')} >
            <div>Sắp xếp theo</div>
            <Radio.Group buttonStyle="solid" value={valueSelected} onChange={onChange}>
                <Space>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_SALE}>
                        <div>Bán chạy</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_DATETIME}>
                        <div >Mới nhất</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_PRICE_ASC}>
                        <div >Giá tăng dần</div>
                    </Radio.Button>
                    <Radio.Button className={cx('radio-button', 'search-radio-button-checked', 'bg-white')} value={SORTED_BY_PRICE_DESC}>
                        <div >Giá thấp dần</div>
                    </Radio.Button>
                </Space>
            </Radio.Group>
        </Space>
    );
}

/// styles
const styleImage = { width: '100%', height: 192 }
const ratingStarStyle = { color: '#ee4d2d', fontSize: '.625rem', borderBottom: '1px solid white' }
const styleContainerImage = { width: '100%', height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const styleOriginPrice = { fontSize: 14 };
const styleDiscountPrice = { color: '#ee4d2d', fontSize: '1rem', marginTop: 25 };
const opacityDisabledStyle = { opacity: 0.5 };
const styleSpaceContainerProductItem = { padding: 8, height: 124, width: '100%' };
const styleProductName = { fontSize: 12, color: '#000000', cursor: 'pointer' };
///
function Products({ totalItems = 0, products = [], page = 1, onSelectPage = () => { } }) {
    const navigate = useNavigate();
    const handleClickToProduct = (productId) => {
        return navigate(`/product/${productId}`);
    }
    return (
        <div style={{ marginTop: '0.8em' }}>
            <Space direction="vertical" style={{ width: '100%' }}>

                <Space size={[9, 16]} wrap>
                    {products.map((product, index) => (
                        <div
                            style={product.quantityProductRemaining === 0 || product.productStatusId === PRODUCT_BAN ? opacityDisabledStyle : {}}
                            key={index}
                            className={cx('item-product')}
                            onClick={() => handleClickToProduct(product.productId)}
                        >
                            <div style={styleContainerImage}>
                                {
                                    product.productStatusId === PRODUCT_BAN ?
                                        <div className={cx('circle')}> Sản phẩm này đã bị ẩn</div>
                                        : product.quantityProductRemaining === 0 ? <div className={cx('circle')}>Hết hàng</div> : <></>
                                }
                                <img style={styleImage} src={product.thumbnail} alt="product" />
                            </div>
                            <Space direction="vertical" style={styleSpaceContainerProductItem}>
                                <p style={styleProductName}>{product.productName}</p>
                                {
                                    product.productVariant?.discount !== 0 ? (<>
                                        <div className={cx('discount-style')}><p style={{ fontSize: 10 }}>{product.productVariant.discount}% giảm</p></div>
                                        <Space align="center">
                                            <Text delete strong type="secondary" style={styleOriginPrice}>{formatPrice(product.productVariant.price)}</Text>
                                            <Text style={styleDiscountPrice}>{formatPrice(discountPrice(product.productVariant.price, product.productVariant.discount))}</Text>
                                        </Space>
                                    </>
                                    ) : (<p level={4} style={styleDiscountPrice}>{formatPrice(product.productVariant.price)}</p>)
                                }
                                <Space align="center" style={{ marginTop: 5 }}>
                                    <Rate disabled defaultValue={product.totalRatingStar / product.numberFeedback} style={ratingStarStyle} />
                                    <p style={{ fontSize: 12 }}>Đã bán {formatNumber(product.soldCount)}</p>
                                </Space>

                            </Space>

                        </div>
                    ))}
                </Space>
                <Row className={cx('flex-item-center', 'margin-top-40')}>
                    <Pagination hideOnSinglePage current={page} defaultCurrent={1} total={totalItems} pageSize={PAGE_SIZE_SEARCH_PRODUCT} onChange={onSelectPage} />
                </Row>
            </Space>
        </div>
    );
}
function ConvertSearchParamObjectToString(searchParam = {}) {
    let result = '';
    for (const property in searchParam) {
        if (searchParam[property]) {
            result += `${property}=${searchParam[property]}&`;
        }
    }
    return result.slice(0, result.length - 1)
}

function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
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
        getListProductSearch(getSearchParams)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProducts(res.data.result.products);
                    setTotalItems(res.data.result.totalItems);
                }
            })
            .catch(err => {
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
        setPage(value);
        let newSearchParams = { ...getSearchParams, page: value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    return (
        <Layout className={cx('container')} >
            <Sider className={cx('sider')}>
                <Space style={{ marginBottom: '1.8em' }}>
                    <FilterOutlined style={{ fontSize: '1.17em' }} />
                    <h3> Bộ Lọc Tìm Kiếm</h3>
                </Space>
                <FilterGroupCategory listCategory={categories}
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
                    <SortBar
                        valueSelected={parseInt(getSearchParams.sort)}
                        onChange={handleChangeSelectSort}
                    />
                    <Products products={products} totalItems={totalItems} page={page} onSelectPage={handleSelectPage} />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Search;