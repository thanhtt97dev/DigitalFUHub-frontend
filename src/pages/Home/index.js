import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import Sliders from '~/components/Home/Sliders';
import Products from '~/components/Home/Products';
import Categories from '~/components/Home/Categories';
import { FloatButton } from 'antd';
import { RESPONSE_CODE_SUCCESS } from '~/constants';
import { getProductForHomePageCustomer } from "~/api/product";

///
const cx = classNames.bind(styles);
///

const Home = () => {

    /// states
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchParam, setSearchParam] = useState({
        categoryId: 0,
        page: 1
    });
    ///


    /// useEffects
    useEffect(() => {
        setIsLoadingProducts(true);

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
            .catch((err) => { })
            .finally(() => {
                setTimeout(() => {
                    setIsLoadingProducts(false);
                }, 500);
            })

    }, [searchParam])
    ///

    return (
        <Spinning spinning={isLoadingProducts}>
            <div className={cx('container')}>
                <Sliders />
                <Categories searchParam={searchParam}
                    setSearchParam={setSearchParam} />
                <Products products={products}
                    setSearchParam={setSearchParam}
                    totalProducts={totalProducts}
                    searchParam={searchParam} />
            </div>
            <FloatButton.BackTop visibilityHeight={0} />
        </Spinning>
    );
}

export default Home;