import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Row } from 'antd';
import Products from '~/components/Home/Products';
import Categories from '~/components/Home/Categories';
import { getProductForHomePageCustomer } from "~/api/product";
import { RESPONSE_CODE_SUCCESS } from '~/constants';

///
const cx = classNames.bind(styles);
///

const Home = () => {

    /// states
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchParam, setSearchParam] = useState({
        categoryId: 0,
        isOrderFeedback: false,
        isOrderSoldCount: false,
        page: 1
    });
    ///


    /// useEffects
    useEffect(() => {
        getProductForHomePageCustomer(searchParam)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setProducts(result.products);
                        setTotalProducts(result.totalProduct);

                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }, [searchParam])
    ///

    return (
        <div className={cx('container')}>
            <Row>
                <Categories searchParam={searchParam}
                    setSearchParam={setSearchParam} />
                <Products products={products}
                    setSearchParam={setSearchParam}
                    totalProducts={totalProducts}
                    searchParam={searchParam} />
            </Row>
        </div>
    );
}

export default Home;