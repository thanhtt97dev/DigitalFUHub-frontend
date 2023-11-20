import React, { useState, useEffect } from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/Home/Home.module.scss';
import { Space } from 'antd';
import { getAllCategory } from "~/api/category";
import { RESPONSE_CODE_SUCCESS } from '~/constants';

///
const cx = classNames.bind(styles);
///

/// styles
const styleTitleCategories = { padding: 20, width: '100%', boxShadow: '#d3d3d3 0px 0px 1px 0px' };
const styleCategorySelected = { color: '#ee4d2d', fontSize: '14px', fontWeight: 700, lineHeight: '16px' };
const styleContainerComponentCategories = { backgroundColor: '#ffffff', marginBottom: 20, width: '100%', boxShadow: '#d3d3d3 0px 0px 1px 0px', borderRadius: 2 };
///

const Categories = ({ searchParam, setSearchParam }) => {
    /// states
    const [categories, setCategories] = useState([]);
    ///

    /// handles
    const handleSelectCategory = (categoryId) => {
        // new param search
        const newParamSearch = {
            ...searchParam,
            categoryId: categoryId
        }

        setSearchParam(newParamSearch);
    }
    ///

    /// useEffects
    useEffect(() => {
        getAllCategory()
            .then(res => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setCategories(data.result);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    ///

    return (<div style={styleContainerComponentCategories}>
        <div style={styleTitleCategories}>
            <p className={cx('text-title')}>DANH MỤC</p>
        </div>
        <Space size={[0, 0]} wrap>
            <div className={cx('item-category')} style={searchParam.categoryId === 0 ? styleCategorySelected : {}} onClick={() => handleSelectCategory(0)}>
                <p>Tất cả</p>
            </div>
            {
                categories.map((category, index) => (
                    <div key={index} className={cx('item-category')} onClick={() => handleSelectCategory(category.categoryId)} style={searchParam.categoryId === category.categoryId ? styleCategorySelected : {}}>
                        <p style={searchParam.categoryId === category.categoryId ? styleCategorySelected : {}}>{category.categoryName}</p>
                    </div>
                ))
            }
        </Space>
    </div>
    )
}

export default Categories;
